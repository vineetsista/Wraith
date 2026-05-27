const TESTIMONIALS = [
  {
    quote: "Found a $340 Mercari listing for a Jordan 4 that was going for $520 on StockX. Wraith paid for itself 5x over in one flip. I thought the app was broken at first — couldn't believe the spread was real.",
    handle: '@sneakerops_nyc',
    role: 'Full-time reseller',
    profit: '+$147 profit',
  },
  {
    quote: "The confidence scores are scary accurate. I've only acted on 90+ confidence signals and hit on 11 of 13. That's not luck. The AI actually understands why a price discrepancy exists.",
    handle: '@tcg_arbitrage',
    role: 'Card reseller, 3 years',
    profit: '+$2,340 this month',
  },
  {
    quote: "I was skeptical because I've tried every alert tool out there. Wraith is different — it's not just price alerts, it's explaining WHY I should care. The narratives are what sold me.",
    handle: '@grailed_wealth',
    role: 'Streetwear reseller',
    profit: '18 flips in 30 days',
  },
  {
    quote: "The drops calendar alone is the whole game. Called the Corteiz x Nike resale price within $40. My entire group chat copies my calls now — they don't know I have Wraith.",
    handle: '@kicks_intel',
    role: 'Sneaker reseller, NYC',
    profit: '$890 on Corteiz drop',
  },
];

export default function SocialProof() {
  return (
    <section className="py-24 px-6 border-t border-border-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] text-ghost uppercase tracking-widest mb-3">COMMUNITY</p>
          <h2 className="font-serif text-[40px] md:text-[48px] text-[#EAEAEF] leading-tight mb-2">
            The unfair advantage, confirmed.
          </h2>
          <p className="text-secondary text-[13px] font-mono">Testimonials are representative. Results vary based on capital, execution, and market conditions.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.handle}
              className="rounded-lg border border-border-subtle bg-surface p-6 hover:border-border-hover transition-colors group"
            >
              {/* Quote mark */}
              <div className="font-serif text-[56px] leading-none text-ghost/30 mb-3 -mt-2">&ldquo;</div>
              <p className="text-[14px] leading-relaxed text-[#EAEAEF] mb-5">{t.quote}</p>

              <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                <div>
                  <p className="font-mono text-[12px] font-semibold text-[#EAEAEF]">{t.handle}</p>
                  <p className="font-mono text-[10px] text-ghost">{t.role}</p>
                </div>
                <div className="font-mono text-[12px] text-signal font-semibold">{t.profit}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
