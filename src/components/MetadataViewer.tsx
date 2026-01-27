import { useState } from 'react'
import type { ImageMetadata } from '../types'

interface MetadataViewerProps {
  original?: ImageMetadata
  cleaned?: ImageMetadata
}

const categoryLabels: Record<string, string> = {
  location: '📍 Location',
  camera: '📷 Camera',
  datetime: '📅 Date & Time',
  software: '💻 Software',
  other: '📋 Other',
}

const categoryOrder = ['location', 'camera', 'datetime', 'software', 'other']

export function MetadataViewer({ original, cleaned }: MetadataViewerProps) {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before')

  if (!original) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>No metadata found in this image.</p>
      </div>
    )
  }

  // Group items by category
  const groupedOriginal = original.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof original.items>)

  const hasMetadata = original.items.length > 0

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-lg p-1 mb-4">
        <button
          onClick={() => setActiveTab('before')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'before'
              ? 'bg-background shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Before ({original.items.length})
        </button>
        <button
          onClick={() => setActiveTab('after')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'after'
              ? 'bg-background shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          After ({cleaned?.items.length || 0})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'before' ? (
        hasMetadata ? (
          <div className="space-y-4">
            {categoryOrder.map((category) => {
              const items = groupedOriginal[category]
              if (!items || items.length === 0) return null

              return (
                <div key={category}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    {categoryLabels[category]}
                  </h4>
                  <div className="space-y-1">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-secondary/50"
                      >
                        <span className="text-sm text-muted-foreground">{item.key}</span>
                        <span className="text-sm font-mono">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Privacy warning for GPS */}
            {original.hasGPS && (
              <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div className="text-sm">
                  <p className="font-medium text-amber-600 dark:text-amber-400">
                    GPS coordinates detected
                  </p>
                  <p className="text-muted-foreground">
                    This could reveal your home, workplace, or other sensitive locations.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No metadata found in this image.</p>
          </div>
        )
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-3">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-green-500" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="font-medium text-green-600 dark:text-green-400">
            All metadata removed!
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            The cleaned image contains no identifying information.
          </p>
        </div>
      )}
    </div>
  )
}
