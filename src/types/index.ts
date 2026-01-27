export interface MetadataItem {
  key: string
  value: string
  category: 'location' | 'camera' | 'datetime' | 'software' | 'other'
}

export interface ImageMetadata {
  items: MetadataItem[]
  hasGPS: boolean
  hasCamera: boolean
  hasDateTime: boolean
}

export interface ProcessedImage {
  id: string
  file: File
  status: 'pending' | 'processing' | 'done' | 'error'
  originalSize: number
  cleanedSize?: number
  cleanedBlob?: Blob
  cleanedUrl?: string
  thumbnailUrl?: string
  originalMetadata?: ImageMetadata
  cleanedMetadata?: ImageMetadata
  savings?: {
    bytes: number
    percentage: number
  }
  error?: string
}

export interface ThemeMode {
  value: 'light' | 'dark' | 'system'
  resolved: 'light' | 'dark'
}
