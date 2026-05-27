'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How does Wraith find signals?',
    a: 'Wraith continuously crawls pricing data across StockX, GOAT, eBay, Mercari, and Grailed every 15 minutes. Our AI compares prices for the same item across platforms, adjusts for fees, and surfaces opportunities where the spread creates meaningful profit potential. We also track social signals (TikTok, Instagram) to identify items gaining momentum before price reflects it.',
  },
  {
    q: 'What platforms do you scan?',
    a: 'StockX, GOAT, eBay, Mercari, and Grailed. Each platform has different buyer demographics and fee structures, which is precisely why arbitrage opportunities exist between them. We plan to add DEWU (China), Vestiaire Collective, and Whatnot in Q1 2025.',
  },
  {
    q: 'How often are signals updated?',
    a: 'The signal engine runs every 15 minutes. High-priority signals (ACT NOW) are refreshed every 5 minutes because price windows close fast. You\'ll receive Discord alerts in real-time as new high-confidence signals are detected.',
  },
  {
    q: 'What\'s your hit rate?',
    a: 'Among 90+ confidence signals, our retroactive analysis shows 74% would have been profitable after fees. This varies by category — sneaker arbitrage is more reliable than electronics due to authentication standards. We publish our confidence calibration data in the Analytics tab.',
  },
  {
    q: 'Can I get Discord alerts?',
    a: 'Yes. Connect your Discord webhook in Settings and configure minimum confidence and profit thresholds. Alerts fire in real-time with full signal details, price comparison, and AI narrative directly in your server. No third-party bot required.',
  },
  {
    q: 'What categories do you cover?',
    a: 'Sneakers, streetwear, trading cards (Pokémon, NBA, One Piece, MTG), vintage accessories, limited electronics, and collectibles (GPK, comics, memorabilia). We cover anything with an active secondary market across our monitored platforms.',
  },
  {
    q: 'Is this legal?',
    a: 'Absolutely. Wraith aggregates publicly available pricing data and uses AI to identify market inefficiencies. This is identical to how professional traders use Bloomberg or financial analytics platforms. Buying and reselling items for profit (flipping) is legal in all US jurisdictions. We do not facilitate any automated purchasing — Wraith is an intelligence platform, not a bot.',
  },
  {
    q: 'Is there a paid plan?',
    a: 'No. Wraith is a personal project — built to explore what an AI-native resale intelligence product could look like. There is no signup, no paywall, no billing. The whole experience runs locally with bundled sample data, and the source is on GitHub if you want to fork it.',
  },
  {
    q: 'Can I run my own instance?',
    a: 'Yes. Clone github.com/vineetsista/Wraith, run npm install and npm run dev. No API keys required — sample signals ship with the repo. Everything works out of the box, including the AI chat (scripted), the live signal stream, and the admin console.',
  },
];

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6 border-t border-border-subtle">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] text-ghost uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="font-serif text-[40px] text-[#EAEAEF] leading-tight">
            Questions answered.
          </h2>
        </div>

        <div className="space-y-1">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-border-subtle rounded-lg overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-elevated transition-colors"
              >
                <span className="text-[14px] font-semibold text-[#EAEAEF] pr-4">{faq.q}</span>
                <ChevronDown
                  size={14}
                  className="flex-shrink-0 text-ghost transition-transform duration-200"
                  style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 border-t border-border-subtle animate-fade-in">
                  <p className="text-[14px] text-secondary leading-relaxed pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
