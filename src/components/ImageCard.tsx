import { useEffect, useRef, useState } from 'react'
import type { ProcessedImage, ImageMetadata } from '../types'
import { MetadataViewer } from './MetadataViewer'
import { formatBytes, downloadFile, copyToClipboard } from '../lib/file-utils'
import { isWasmReady, extractMetadata, stripMetadata, calculateSavings } from '../lib/wasm-loader'

interface ImageCardProps {
  image: ProcessedImage
  onUpdate: (updates: Partial<ProcessedImage>) => void
  onRemove: () => void
}

export function ImageCard({ image, onUpdate, onRemove }: ImageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'success' | 'error'>('idle')
  const thumbnailRef = useRef<HTMLImageElement>(null)

  // Create optimized thumbnail using createImageBitmap
  useEffect(() => {
    if (image.thumbnailUrl) return

    const createThumbnail = async () => {
      try {
        const bitmap = await createImageBitmap(image.file, {
          resizeWidth: 200,
          resizeHeight: 200,
          resizeQuality: 'medium',
        })
        
        const canvas = document.createElement('canvas')
        canvas.width = bitmap.width
        canvas.height = bitmap.height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(bitmap, 0, 0)
          canvas.toBlob((blob) => {
            if (blob) {
              onUpdate({ thumbnailUrl: URL.createObjectURL(blob) })
            }
          }, 'image/jpeg', 0.7)
        }
        bitmap.close()
      } catch {
        // Fallback: use full image as thumbnail
        onUpdate({ thumbnailUrl: URL.createObjectURL(image.file) })
      }
    }

    createThumbnail()
  }, [image.file, image.thumbnailUrl, onUpdate])

  // Process image with WASM when ready
  useEffect(() => {
    if (image.status !== 'pending') return
    if (!isWasmReady()) return

    const processImage = async () => {
      onUpdate({ status: 'processing' })
      
      try {
        // Read file as bytes
        const arrayBuffer = await image.file.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        
        // Extract original metadata
        const originalMeta = extractMetadata(bytes)
        const originalMetadata: ImageMetadata = {
          items: originalMeta.items.map(item => ({
            key: item.key,
            value: item.value,
            category: item.category as 'location' | 'camera' | 'datetime' | 'software' | 'other',
          })),
          hasGPS: originalMeta.hasGPS,
          hasCamera: originalMeta.hasCamera,
          hasDateTime: originalMeta.hasDateTime,
        }
        
        // Strip metadata
        const cleanedBytes = stripMetadata(bytes)
        // Create a copy of the bytes as a new Uint8Array to ensure it's a proper ArrayBuffer
        const cleanedArray = new Uint8Array(cleanedBytes)
        const cleanedBlob = new Blob([cleanedArray], { type: image.file.type })
        const cleanedUrl = URL.createObjectURL(cleanedBlob)
        
        // Extract cleaned metadata (should be empty)
        const cleanedMeta = extractMetadata(cleanedBytes)
        const cleanedMetadata: ImageMetadata = {
          items: cleanedMeta.items.map(item => ({
            key: item.key,
            value: item.value,
            category: item.category as 'location' | 'camera' | 'datetime' | 'software' | 'other',
          })),
          hasGPS: cleanedMeta.hasGPS,
          hasCamera: cleanedMeta.hasCamera,
          hasDateTime: cleanedMeta.hasDateTime,
        }
        
        // Calculate savings
        const savings = calculateSavings(image.originalSize, cleanedBlob.size)
        
        onUpdate({
          status: 'done',
          cleanedBlob,
          cleanedUrl,
          cleanedSize: cleanedBlob.size,
          originalMetadata,
          cleanedMetadata,
          savings,
        })
      } catch (error) {
        console.error('Processing failed:', error)
        onUpdate({
          status: 'error',
          error: error instanceof Error ? error.message : 'Processing failed',
        })
      }
    }

    processImage()
  }, [image.status, image.file, image.originalSize, onUpdate])

  const handleDownload = () => {
    if (image.cleanedBlob) {
      const ext = image.file.name.split('.').pop() || 'jpg'
      const baseName = image.file.name.replace(/\.[^/.]+$/, '')
      downloadFile(image.cleanedBlob, `${baseName}_clean.${ext}`)
    }
  }

  const handleCopy = async () => {
    if (!image.cleanedBlob) return
    
    setCopyStatus('copying')
    const success = await copyToClipboard(image.cleanedBlob)
    setCopyStatus(success ? 'success' : 'error')
    setTimeout(() => setCopyStatus('idle'), 2000)
  }

  return (
    <div className={`border rounded-xl overflow-visible animate-slide-up transition-all duration-300 ${
      image.status === 'done' 
        ? 'border-green-500/50 bg-green-500/5 shadow-lg shadow-green-500/10' 
        : 'border-border bg-card'
    }`}>
      <div className="flex items-center gap-4 p-4">
        {/* Thumbnail */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
          {image.thumbnailUrl ? (
            <img
              ref={thumbnailRef}
              src={image.thumbnailUrl}
              alt={image.file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full animate-pulse bg-muted" />
          )}
          
          {/* Status overlay */}
          {image.status === 'processing' && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <svg className="w-6 h-6 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
              </svg>
            </div>
          )}
          
          {image.status === 'done' && (
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-in ring-2 ring-white dark:ring-gray-900">
              <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-white" stroke="currentColor" strokeWidth="4">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
          
          {image.status === 'error' && (
            <div className="absolute inset-0 bg-destructive/80 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{image.file.name}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatBytes(image.originalSize)}</span>
            {image.savings && image.savings.bytes > 0 && (
              <>
                <span>→</span>
                <span className="text-green-600 dark:text-green-400">
                  -{formatBytes(image.savings.bytes)} ({image.savings.percentage}%)
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {image.status === 'done' && (
            <>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Copy to clipboard"
                data-tooltip="Copy"
              >
                {copyStatus === 'success' ? (
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-green-500" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : copyStatus === 'copying' ? (
                  <svg className="w-5 h-5 animate-spin text-muted-foreground" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-muted-foreground" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Download cleaned image"
                data-tooltip="Download"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-muted-foreground" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label={isExpanded ? 'Collapse metadata' : 'Expand metadata'}
                data-tooltip={isExpanded ? 'Hide details' : 'Show details'}
              >
                <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </>
          )}
          <button
            onClick={onRemove}
            className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
            aria-label="Remove image"
            data-tooltip="Remove"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded metadata view */}
      {isExpanded && image.originalMetadata && (
        <div className="border-t border-border">
          <MetadataViewer
            original={image.originalMetadata}
            cleaned={image.cleanedMetadata}
          />
        </div>
      )}
    </div>
  )
}
