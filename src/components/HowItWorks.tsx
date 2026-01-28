const BentoItem = ({ title, description, children, className }: { title: string; description: string; children: React.ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>
    <div className="p-6 flex flex-col h-full">
      <div className="flex-1 mb-6 flex items-center justify-center bg-secondary/30 rounded-lg overflow-hidden relative group">
        <div className="absolute inset-0 bg-grid-dots dark:bg-grid-dots-light opacity-20" />
        {children}
      </div>
      <h3 className="font-semibold tracking-tight text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
)

export function HowItWorks() {
  return (
    <section className="mt-24 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
          Client-side security. Server-grade power.
        </h2>
        <p className="text-muted-foreground max-w-[600px] mx-auto">
          We rebuilt the image processing pipeline to run 100% in your browser using Rust and WebAssembly.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {/* Card 1: Processing */}
        <BentoItem 
          title="Local Processing" 
          description="Powered by a custom Rust WASM engine that runs natively on your device's CPU."
          className="md:col-span-2"
        >
          <div className="w-full max-w-sm border rounded-lg bg-background shadow-sm p-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b pb-2 mb-2">
               <span className="text-muted-foreground">terminal</span>
               <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
               </div>
            </div>
            <div className="space-y-1">
              <div className="flex gap-2">
                <span className="text-green-500">➜</span>
                <span className="text-primary">meta.zip</span>
                <span>process ./photo.jpg</span>
              </div>
              <div className="text-muted-foreground pl-4">
                Loading WASM engine... OK
              </div>
              <div className="text-muted-foreground pl-4">
                Parsing EXIF markers... FOUND (14)
              </div>
              <div className="text-muted-foreground pl-4">
                Stripping metadata... DONE
              </div>
              <div className="text-green-600 pl-4">
                Saved 12.4 kB (4.2%)
              </div>
            </div>
          </div>
        </BentoItem>

        {/* Card 2: Speed */}
        <BentoItem 
          title="Zero Latency" 
          description="No network requests. No uploads. Instant feedback."
          className=""
        >
           <div className="relative flex items-center justify-center w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-[spin_3s_linear_infinite]" />
                 <div className="w-20 h-20 rounded-full border-4 border-primary/40 animate-[spin_4s_linear_infinite_reverse]" />
              </div>
              <div className="text-center z-10 bg-card/80 backdrop-blur px-3 py-1 rounded-full border shadow-sm">
                 <span className="font-mono font-bold text-2xl tracking-tighter">~12ms</span>
              </div>
           </div>
        </BentoItem>

        {/* Card 3: Privacy */}
        <BentoItem 
          title="Privacy by Default" 
          description="Your raw photos never touch our servers. Verify it yourself on GitHub."
          className=""
        >
           <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                 <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
                   <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                   <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                 </svg>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                 Offline Ready
              </div>
           </div>
        </BentoItem>

        {/* Card 4: Formats */}
        <BentoItem 
          title="Universal Support" 
          description="JPEG, PNG, WebP, and TIFF support out of the box."
          className="md:col-span-2"
        >
           <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              {['JPEG', 'PNG', 'WEBP', 'TIFF'].map((fmt) => (
                 <div key={fmt} className="flex items-center gap-3 p-3 rounded-lg border bg-background/50 hover:bg-background transition-colors">
                    <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                       {fmt}
                    </div>
                    <div className="space-y-1">
                       <div className="h-1.5 w-12 bg-muted rounded-full" />
                       <div className="h-1.5 w-8 bg-muted/50 rounded-full" />
                    </div>
                 </div>
              ))}
           </div>
        </BentoItem>
      </div>
    </section>
  )
}
