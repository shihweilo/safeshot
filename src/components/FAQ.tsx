import { useState } from 'react'

export function FAQ() {
  const faqs = [
    {
      question: "Does SafeShot upload my photos?",
      answer: "No. SafeShot runs entirely in your browser using a technology called WebAssembly. Your photos never leave your device, ensuring 100% privacy."
    },
    {
      question: "Is SafeShot free to use?",
      answer: "Yes, SafeShot is completely free and open source. There are no hidden fees, subscriptions, or usage limits."
    },
    {
      question: "What metadata does SafeShot remove?",
      answer: "SafeShot strips all EXIF data, which includes GPS coordinates, camera model, lens settings, date/time stamps, and other embedded information."
    }
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="mt-16 mb-12 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border rounded-xl bg-card overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span>{faq.question}</span>
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className={`w-5 h-5 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div 
              className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="p-4 pt-0 text-muted-foreground text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
