import { useCallback, useState } from 'react'
import config from '../lib/config'

interface UploadZoneProps {
  onFilesAdded: (files: File[]) => void
  disabled?: boolean
}

export function UploadZone({ onFilesAdded, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFiles = useCallback((files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = []
    const errors: string[] = []

    for (const file of files) {
      if (!config.supportedFormats.includes(file.type)) {
        errors.push(`${file.name}: Unsupported format`)
        continue
      }
      if (file.size > config.maxFileSize) {
        errors.push(`${file.name}: File too large (max 50MB)`)
        continue
      }
      valid.push(file)
    }

    return { valid, errors }
  }, [])

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const { valid, errors } = validateFiles(fileArray)

    if (errors.length > 0) {
      setError(errors.join(', '))
      setTimeout(() => setError(null), 5000)
    }

    if (valid.length > 0) {
      onFilesAdded(valid)
    }
  }, [onFilesAdded, validateFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) {
      setError('Clear processed images first to upload more')
      setTimeout(() => setError(null), 3000)
      return
    }

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [disabled, handleFiles])

  const handleClick = useCallback(() => {
    if (disabled) {
      setError('Clear processed images first to upload more')
      setTimeout(() => setError(null), 3000)
      return
    }
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = config.supportedFormats.join(',')
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) handleFiles(files)
    }
    input.click()
  }, [disabled, handleFiles])

  return (
    <div className="space-y-2">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-200 ease-out
          ${isDragging 
            ? 'border-primary bg-primary/5 scale-[1.01]' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        role="button"
        tabIndex={0}
        aria-label="Upload images"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`
            w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center
            ${isDragging ? 'animate-pulse-soft' : ''}
          `}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-8 h-8 text-primary"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <div>
            <p className="text-lg font-medium">
              {isDragging ? 'Drop your images here' : 'Drag & drop images here'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse • paste with <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs font-mono">Ctrl+V</kbd>
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-secondary rounded-full">JPEG</span>
            <span className="px-2 py-1 bg-secondary rounded-full">PNG</span>
            <span className="px-2 py-1 bg-secondary rounded-full">WebP</span>
            <span className="px-2 py-1 bg-secondary rounded-full">TIFF</span>
            <span className="px-2 py-1 bg-secondary rounded-full">Max 50MB</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg animate-slide-up">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 shrink-0" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}
