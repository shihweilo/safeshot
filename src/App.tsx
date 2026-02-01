import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { UploadZone } from './components/UploadZone'
import { ImageCard } from './components/ImageCard'
import { HowItWorks } from './components/HowItWorks'
import { Footer } from './components/Footer'
import { useTheme } from './hooks/useTheme'
import { initWasm } from './lib/wasm-loader'
import type { ProcessedImage } from './types'

function App() {
  const { theme, setTheme } = useTheme()
  const [images, setImages] = useState<ProcessedImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [wasmReady, setWasmReady] = useState(false)
  const [wasmError, setWasmError] = useState<string | null>(null)

  // Initialize WASM on mount
  useEffect(() => {
    initWasm()
      .then(() => setWasmReady(true))
      .catch((err) => {
        console.error('WASM init failed:', err)
        setWasmError('Failed to load processing engine. Please refresh.')
      })
  }, [])

  // Reset isProcessing when all images are removed
  useEffect(() => {
    if (images.length === 0) {
      setIsProcessing(false)
    }
  }, [images.length])

  // State for paste blocked message
  const [pasteBlocked, setPasteBlocked] = useState(false)

  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      const imageFiles: File[] = []
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) imageFiles.push(file)
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault()
        
        // Block paste if processing
        if (isProcessing) {
          setPasteBlocked(true)
          setTimeout(() => setPasteBlocked(false), 3000)
          return
        }
        
        handleFilesAdded(imageFiles)
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [isProcessing])

  const handleFilesAdded = async (files: File[]) => {
    // Create pending entries for each file
    const newImages: ProcessedImage[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: 'pending' as const,
      originalSize: file.size,
    }))

    setImages((prev) => [...prev, ...newImages])
    setIsProcessing(true)

    // Process will be handled by ImageCard components
    // when WASM is ready
  }

  const handleImageUpdate = (id: string, updates: Partial<ProcessedImage>) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
    )
  }

  // State for cleared message
  const [clearMessage, setClearMessage] = useState(false)

  const showClearMessage = () => {
    setClearMessage(true)
    setTimeout(() => setClearMessage(false), 3000)
  }

  const handleRemoveImage = (id: string) => {
    const img = images.find((i) => i.id === id)
    if (img?.thumbnailUrl) URL.revokeObjectURL(img.thumbnailUrl)
    if (img?.cleanedUrl) URL.revokeObjectURL(img.cleanedUrl)
    
    // If this is the last image, reset processing state and show message
    if (images.length === 1) {
      setIsProcessing(false)
      showClearMessage()
    }
    
    setImages((prev) => prev.filter((i) => i.id !== id))
  }

  const handleClearAll = () => {
    // Revoke all blob URLs for memory cleanup
    images.forEach((img) => {
      if (img.thumbnailUrl) URL.revokeObjectURL(img.thumbnailUrl)
      if (img.cleanedUrl) URL.revokeObjectURL(img.cleanedUrl)
    })
    setImages([])
    setIsProcessing(false)
    showClearMessage()
  }

  const completedImages = images.filter((img) => img.status === 'done')

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} onThemeChange={setTheme} />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Strip metadata from photos.
            <br />
            <span className="text-foreground">Privately. Instantly.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Remove <span className="text-foreground font-medium underline underline-offset-4 decoration-dotted decoration-foreground/20 cursor-help" data-tooltip="Exchangeable Image File Format — hidden data like location, camera model, and settings.">Exif</span> markers, GPS coordinates, and sensitive camera info before
            sharing. Everything runs in your browser — your photos never leave your
            device.
          </p>
        </section>

        {/* WASM Loading State */}
        {!wasmReady && !wasmError && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeLinecap="round" />
            </svg>
            <span>Loading processing engine...</span>
          </div>
        )}

        {wasmError && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-3 rounded-lg mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{wasmError}</span>
          </div>
        )}

        {/* Upload Zone */}
        <UploadZone onFilesAdded={handleFilesAdded} disabled={isProcessing || !wasmReady} />

        {/* Feature Cards for Non-Tech Users */}
        {!isProcessing && images.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-slide-up">
            <div className="p-6 rounded-2xl border bg-card hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                <span className="text-xl font-bold text-violet-600">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Upload Securely</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Add your photos with total confidence. They are processed entirely on your device and never leave your hands.
              </p>
            </div>

            <div className="p-6 rounded-2xl border bg-card hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                <span className="text-xl font-bold text-violet-600">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Protection</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our engine instantly wipes hidden location codes, camera details, and tracking data to protect your digital footprint.
              </p>
            </div>

            <div className="p-6 rounded-2xl border bg-card hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                <span className="text-xl font-bold text-violet-600">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Share With Peace</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Download your clean photos and share them safely. Protect your identity and personal location everywhere you go.
              </p>
            </div>
          </div>
        )}

        {/* Paste blocked message */}
        {pasteBlocked && (
          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-500/10 px-4 py-2 rounded-lg mt-2 animate-slide-up">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 shrink-0" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Clear processed images first to paste more
          </div>
        )}

        {/* Images cleared message */}
        {clearMessage && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-500/10 px-4 py-3 rounded-lg mt-4 animate-slide-up">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span>
              <strong>All images cleared from memory.</strong> Your photos were never uploaded — everything was processed locally in your browser.
            </span>
          </div>
        )}

        {/* Results Section */}
        {images.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {completedImages.length} of {images.length} processed
              </h2>
              <button
                onClick={handleClearAll}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="grid gap-4">
              {images.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onUpdate={(updates) => handleImageUpdate(image.id, updates)}
                  onRemove={() => handleRemoveImage(image.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* How It Works Section */}
        <HowItWorks />

        {/* Privacy Features Section */}
        <section className="mt-8 pt-8 pb-16 border-t border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto text-sm">
            {[
              "Images never leave the device",
              "No server uploads",
              "No local storage persistence",
              "Automatic cleanup on tab close"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 px-4 py-2 rounded-full border bg-secondary/30 text-secondary-foreground shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-green-500" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
