'use client';

import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Zap, MessageSquare, Command, Shield, Star, X } from 'lucide-react';
import { useWraith } from '@/lib/wraith-context';
import { useAssistant } from '@/lib/assistant-context';
import { useCommandPalette } from '@/lib/command-palette-context';

const STEPS = [
  {
    icon: Sparkles,
    title: 'Welcome to Wraith',
    body: 'You have an unfair advantage. Wraith scans 47,000+ listings every 30 seconds across StockX, GOAT, eBay, Mercari and Grailed — surfacing only the spreads worth your time.',
  },
  {
    icon: Zap,
    title: 'Signals are pre-vetted edges',
    body: 'Every card on your feed already passed five filters: spread, velocity, social momentum, supply constraint, and historical flip success. Confidence ≥85% means we\'d take it ourselves.',
  },
  {
    icon: MessageSquare,
    title: 'Ask Wraith Intelligence anything',
    body: 'Press ⌘J or hit "Ask Wraith" — your live arbitrage co-pilot. "What\'s the best signal right now?", "Should I buy the Travis Scotts?", "What\'s the risk on my watchlist?"',
  },
  {
    icon: Command,
    title: 'Move at keyboard speed',
    body: 'Press ⌘K to jump to any signal, page, or action. Press G then S/W/P/A/D to navigate. Press ? for the full shortcut list.',
  },
  {
    icon: Star,
    title: 'Your money lives in the Portfolio tab',
    body: 'Mark flips as you make them. Wraith tracks realized P&L, win rate, and surfaces what categories are minting for you right now.',
  },
];

export default function OnboardingTour() {
  const { hydrated, hasSeenTour, markTourSeen, isAdmin } = useWraith();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (hydrated && !hasSeenTour) {
      const t = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(t);
    }
  }, [hydrated, hasSeenTour]);

  if (!open) return null;

  const s = STEPS[step];
  const Icon = s.icon;
  const isLast = step === STEPS.length - 1;

  function next() {
    if (isLast) finish();
    else setStep(s => s + 1);
  }

  function finish() {
    markTourSeen();
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-[105] flex items-center justify-center px-4" style={{ background: 'rgba(5,5,7,0.78)', backdropFilter: 'blur(10px)' }}>
      <div className="w-full max-w-lg rounded-2xl border border-border-hover bg-surface overflow-hidden animate-slide-in-up shadow-card-hover">
        {/* Header glow */}
        <div className="relative h-1 bg-border-subtle overflow-hidden">
          <div className="h-full bg-signal transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 rounded-xl border border-signal/40 bg-signal/5 flex items-center justify-center shadow-signal">
              <Icon size={20} className="text-signal" />
            </div>
            <button onClick={finish} className="w-7 h-7 rounded border border-border-subtle text-ghost hover:text-[#EAEAEF] flex items-center justify-center transition-colors" title="Skip">
              <X size={12} />
            </button>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-wider text-ghost mb-2">Step {step + 1} of {STEPS.length}</p>
          <h2 className="font-serif text-[26px] text-[#EAEAEF] leading-tight mb-3">{s.title}</h2>
          <p className="text-[14px] leading-relaxed text-secondary mb-8">{s.body}</p>

          {isAdmin && step === 0 && (
            <div className="mb-6 p-3 rounded border border-warning/30 bg-warning/5">
              <div className="flex items-center gap-2 mb-1">
                <Shield size={11} className="text-warning" />
                <p className="font-mono text-[11px] font-semibold text-warning">ADMIN ACCESS DETECTED</p>
              </div>
              <p className="font-mono text-[11px] text-secondary">You can toggle between Admin and User views from the nav bar, control demo mode, and access the system console.</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-signal' : 'w-1.5 bg-border-subtle hover:bg-border-hover'}`}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={finish} className="font-mono text-[11px] text-ghost hover:text-secondary transition-colors px-3 py-2">Skip</button>
              <button onClick={next} className="h-9 px-4 rounded border border-signal/40 bg-signal/10 text-signal font-mono text-[12px] font-semibold hover:bg-signal/20 transition-all flex items-center gap-2">
                {isLast ? 'Start trading' : 'Next'} <ArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
