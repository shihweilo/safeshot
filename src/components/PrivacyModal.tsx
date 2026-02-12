import config from '../lib/config'

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-card border rounded-2xl shadow-lg ring-1 ring-border animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="privacy-title"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-card z-10">
          <h2 id="privacy-title" className="text-2xl font-bold">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-84px)] space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-3">1. Local Processing</h3>
            <p>
              SafeShot operates entirely within your browser using WebAssembly technology. When you select or drag photos into SafeShot, they are processed locally on your device's memory.
            </p>
            <p className="mt-2 font-medium text-foreground">
              Your photos are NEVER uploaded to any server, cloud storage, or external database.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground mb-3">2. Data Collection</h3>
            <p>
              We do not collect, store, or share your personal data or your photos. Since there is no server-side component for image processing, we physically cannot access your files.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground mb-3">3. Analytics</h3>
            <p>
              We use <a href="https://vercel.com/analytics" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Vercel Analytics</a> to collect anonymous usage data. This helps us understand how the site is performing and where we can improve.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>What is collected:</strong> Page views, device type (desktop/mobile), browser type, and country of origin (approximate location).</li>
              <li><strong>What is NOT collected:</strong> IP addresses, personal identifiers, or any information about the photos you process.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground mb-3">4. Open Source</h3>
            <p>
              SafeShot is open source software. You can inspect our entire codebase on <a href="https://github.com/shihweilo/safeshot" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">GitHub</a> to verify our privacy claims.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground mb-3">5. Contact</h3>
            <p>
              If you have any questions about this privacy policy, you can reach us at <a href={`mailto:${config.contactEmail}`} className="underline hover:text-foreground">{config.contactEmail}</a> or open an issue on our GitHub repository.
            </p>
          </section>
          
          <div className="pt-6 mt-6 border-t font-mono text-xs text-center text-muted-foreground/60">
            Last updated: February 2026
          </div>
        </div>
      </div>
    </div>
  )
}
