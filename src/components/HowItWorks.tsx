export function HowItWorks() {
  return (
    <section className="mt-16 py-12 border-t border-border">
      <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Step 1 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-primary" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">1. Upload Photos</h3>
          <p className="text-sm text-muted-foreground">
            Drag, drop, paste, or click to add your images. We support JPEG, PNG, WebP, and TIFF.
          </p>
        </div>

        {/* Step 2 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-primary" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">2. Process Locally</h3>
          <p className="text-sm text-muted-foreground">
            All processing happens in your browser using WebAssembly. Your photos never leave your device.
          </p>
        </div>

        {/* Step 3 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-primary" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">3. Download Clean</h3>
          <p className="text-sm text-muted-foreground">
            Get your metadata-free photos. Single file or ZIP for multiple images.
          </p>
        </div>
      </div>

      {/* Privacy callout */}
      <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Your Privacy, Guaranteed</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-green-500" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                No servers — everything runs in your browser
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-green-500" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                No uploads — your photos never leave your device
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-green-500" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                No tracking — zero analytics, no cookies
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-green-500" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Open source — verify the code yourself
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
