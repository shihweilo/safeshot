import JSZip from 'jszip'
import config from './config'

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Get clean filename with _clean suffix
 */
export function getCleanFilename(original: string): string {
  const ext = original.split('.').pop() || 'jpg'
  const baseName = original.replace(/\.[^/.]+$/, '')
  return `${baseName}_clean.${ext}`
}

/**
 * Download a single file
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Download multiple files as a ZIP
 */
export async function downloadAsZip(
  files: Array<{ blob: Blob; filename: string }>
): Promise<void> {
  const zip = new JSZip()
  
  for (const file of files) {
    zip.file(file.filename, file.blob)
  }
  
  const content = await zip.generateAsync({ type: 'blob' })
  downloadFile(content, `safeshot_${Date.now()}.zip`)
}

/**
 * Download files (single, multiple, or ZIP based on count)
 */
export async function downloadFiles(
  files: Array<{ blob: Blob; originalName: string }>
): Promise<void> {
  if (files.length === 0) return
  
  if (files.length === 1) {
    // Single file: direct download
    downloadFile(files[0].blob, getCleanFilename(files[0].originalName))
  } else if (files.length < config.zipThreshold) {
    // 2-4 files: individual downloads
    for (const file of files) {
      downloadFile(file.blob, getCleanFilename(file.originalName))
      // Small delay between downloads
      await new Promise((r) => setTimeout(r, 100))
    }
  } else {
    // 5+ files: ZIP download
    await downloadAsZip(
      files.map((f) => ({
        blob: f.blob,
        filename: getCleanFilename(f.originalName),
      }))
    )
  }
}

/**
 * Copy image blob to clipboard
 */
export async function copyToClipboard(blob: Blob): Promise<boolean> {
  try {
    // Convert to PNG for clipboard compatibility
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return false

    const img = new Image()
    const imageUrl = URL.createObjectURL(blob)
    
    return new Promise((resolve) => {
      img.onload = async () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        URL.revokeObjectURL(imageUrl)
        
        try {
          const pngBlob = await new Promise<Blob | null>((res) =>
            canvas.toBlob(res, 'image/png')
          )
          
          if (pngBlob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': pngBlob }),
            ])
            resolve(true)
          } else {
            resolve(false)
          }
        } catch {
          resolve(false)
        }
      }
      img.onerror = () => {
        URL.revokeObjectURL(imageUrl)
        resolve(false)
      }
      img.src = imageUrl
    })
  } catch {
    return false
  }
}
