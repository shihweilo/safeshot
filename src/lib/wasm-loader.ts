import init, {
  init as wasmInit,
  extract_metadata,
  strip_metadata,
  calculate_savings,
  get_dimensions,
} from '../rust-wasm/pkg/safeshot_wasm'

let wasmInitialized = false

/**
 * Initialize the WASM module
 * Call this once at app startup
 */
export async function initWasm(): Promise<void> {
  if (wasmInitialized) return
  
  try {
    await init()
    wasmInit() // Set up panic hook
    wasmInitialized = true
    console.log('[WASM] Initialized successfully')
  } catch (error) {
    console.error('[WASM] Failed to initialize:', error)
    throw error
  }
}

/**
 * Check if WASM is ready
 */
export function isWasmReady(): boolean {
  return wasmInitialized
}

/**
 * Extract metadata from image bytes
 */
export function extractMetadata(bytes: Uint8Array): {
  items: Array<{ key: string; value: string; category: string }>
  hasGPS: boolean
  hasCamera: boolean
  hasDateTime: boolean
} {
  if (!wasmInitialized) {
    throw new Error('WASM not initialized')
  }
  return extract_metadata(bytes)
}

/**
 * Strip metadata from image bytes
 */
export function stripMetadata(bytes: Uint8Array): Uint8Array {
  if (!wasmInitialized) {
    throw new Error('WASM not initialized')
  }
  return strip_metadata(bytes)
}

/**
 * Calculate savings between original and cleaned
 */
export function calculateSavings(
  originalSize: number,
  cleanedSize: number
): { bytes: number; percentage: number } {
  if (!wasmInitialized) {
    throw new Error('WASM not initialized')
  }
  return calculate_savings(originalSize, cleanedSize)
}

/**
 * Get image dimensions
 */
export function getDimensions(
  bytes: Uint8Array
): { width: number; height: number } {
  if (!wasmInitialized) {
    throw new Error('WASM not initialized')
  }
  return get_dimensions(bytes)
}

export { extract_metadata, strip_metadata, calculate_savings, get_dimensions }
