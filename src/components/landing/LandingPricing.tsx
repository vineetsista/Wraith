'use client';

import Link from 'next/link';
import { Check, Github, Sparkles, Code2, Heart } from 'lucide-react';

const FEATURES = [
  '30+ live sample arbitrage signals',
  'All 5 platforms (StockX, GOAT, eBay, Mercari, Grailed)',
  'All 6 categories covered',
  'AI confidence scoring (0–100) with risk breakdown',
  '90-day price history charts',
  'Live signal stream + activity feed',
  'Wraith Intelligence — AI chat co-pilot (⌘J)',
  'Command palette (⌘K) for everything',
  'Portfolio tracker with monthly P&L',
  'Drops calendar + AI resale predictions',
  'Market heatmap (category × platform)',
  'Admin console with feature flags + audit log',
];

const STACK = [
  'Next.js 14 (App Router)',
  'TypeScript',
  'Tailwind CSS 3',
  'Recharts',
  'Lucide icons',
];

export default function LandingPricing() {
  return (
    <section id="pricing" className="py-24 px-6 border-t border-border-subtle relative">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] text-ghost uppercase tracking-widest mb-3">PROJECT</p>
          <h2 className="font-serif text-[40px] md:text-[48px] text-[#EAEAEF] leading-tight mb-4">
            Free. Open. Personal.
          </h2>
          <p className="text-secondary text-[15px] max-w-xl mx-auto">
            Wraith is a personal project — built to explore what an AI-native resale intelligence
            product could look like. No paywall, no signup, no payment. Clone it, run it, fork it.
          </p>
        </div>

        <div className="relative rounded-xl border border-signal/20 bg-surface overflow-hidden">
          <div className="h-px bg-gradient-to-r from-transparent via-signal to-transparent" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,255,136,0.04) 0%, transparent 70%)' }} />

          <div className="p-8 md:p-12 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-mono text-[56px] font-bold text-signal leading-none">$0</span>
                  <span className="font-mono text-[16px] text-ghost">/ forever</span>
                </div>
                <p className="text-secondary text-[14px] flex items-center gap-1.5">
                  <Heart size={12} className="text-warning" /> A personal project — not a SaaS
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Link
                  href="/dashboard"
                  className="h-12 px-6 rounded border border-signal/50 text-signal font-mono font-semibold text-[14px] hover:bg-signal/10 hover:border-signal transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  style={{ boxShadow: '0 0 24px rgba(0,255,136,0.1)' }}
                >
                  <Sparkles size={14} /> Try the demo
                </Link>
                <a
                  href="https://github.com/vineetsista/Wraith"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-6 rounded border border-border-hover text-[#EAEAEF] font-mono text-[14px] hover:bg-elevated transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Github size={14} /> View source
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-[11px] text-ghost uppercase tracking-wider mb-4">WHAT'S INSIDE</p>
                <ul className="space-y-2.5">
                  {FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={13} className="text-signal flex-shrink-0 mt-0.5" />
                      <span className="text-[13px] text-[#EAEAEF]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-mono text-[11px] text-ghost uppercase tracking-wider mb-4">BUILT WITH</p>
                <ul className="space-y-2.5">
                  {STACK.map((s) => (
                    <li key={s} className="flex items-center gap-2.5">
                      <Code2 size={13} className="text-blue flex-shrink-0" />
                      <span className="text-[13px] text-[#EAEAEF]">{s}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 rounded-lg border border-signal/15 bg-signal/5 p-5">
                  <p className="font-mono text-[11px] text-ghost uppercase tracking-wider mb-2">RUN IT YOURSELF</p>
                  <pre className="font-mono text-[11px] text-signal leading-relaxed overflow-x-auto">
{`git clone github.com/vineetsista/Wraith
cd Wraith && npm install
npm run dev`}
                  </pre>
                  <p className="text-[12px] text-secondary leading-relaxed mt-3">
                    No API keys required. Sample data ships with the repo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
