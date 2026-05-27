'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = 4;

const CATEGORIES = [
  { value: 'sneakers', label: 'Sneakers', icon: '👟', desc: 'Jordan, Nike, Adidas' },
  { value: 'streetwear', label: 'Streetwear', icon: '🧥', desc: 'Supreme, Stüssy, Palace' },
  { value: 'trading_cards', label: 'Trading Cards', icon: '🃏', desc: 'Pokémon, NBA, One Piece' },
  { value: 'vintage', label: 'Vintage', icon: '🕰️', desc: 'Luxury, accessories' },
  { value: 'electronics', label: 'Electronics', icon: '📱', desc: 'Sealed, limited tech' },
  { value: 'collectibles', label: 'Collectibles', icon: '🎯', desc: 'GPK, comics, signed' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [minProfit, setMinProfit] = useState(30);
  const [minConfidence, setMinConfidence] = useState(70);
  const [discordUrl, setDiscordUrl] = useState('');
  const [revealing, setRevealing] = useState(false);
  const router = useRouter();

  function toggleCategory(cat: string) {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }

  async function finish() {
    setRevealing(true);
    await new Promise(r => setTimeout(r, 1800));
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(0,255,136,0.04) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg border border-signal/40 flex items-center justify-center bg-signal/5">
            <Zap size={16} className="text-signal" fill="currentColor" />
          </div>
          <span className="font-serif text-[20px] text-[#EAEAEF]">Wraith</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1.5 mb-8">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-0.5 rounded-full transition-all duration-500"
              style={{ background: i < step ? '#00FF88' : i === step - 1 ? '#00FF88' : 'rgba(255,255,255,0.08)' }}
            />
          ))}
        </div>

        {/* Step content */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-[32px] text-[#EAEAEF] mb-2">What do you flip?</h1>
            <p className="text-secondary text-[14px] mb-6">Select all categories you actively resell. We&apos;ll filter your signals accordingly.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {CATEGORIES.map(cat => {
                const active = categories.includes(cat.value);
                return (
                  <button
                    key={cat.value}
                    onClick={() => toggleCategory(cat.value)}
                    className={cn(
                      'rounded-lg border p-4 text-left transition-all',
                      active
                        ? 'border-signal/40 bg-signal/5'
                        : 'border-border-subtle bg-surface hover:border-border-hover'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{cat.icon}</span>
                      {active && <Check size={13} className="text-signal" />}
                    </div>
                    <p className="font-semibold text-[13px] text-[#EAEAEF]">{cat.label}</p>
                    <p className="font-mono text-[10px] text-ghost">{cat.desc}</p>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={categories.length === 0}
              className="w-full h-10 rounded border border-signal/50 bg-signal/5 text-signal font-mono font-semibold text-[13px] hover:bg-signal/10 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              Continue <ArrowRight size={13} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-[32px] text-[#EAEAEF] mb-2">Set your minimums</h1>
            <p className="text-secondary text-[14px] mb-6">We&apos;ll only show signals that meet your profit and confidence thresholds.</p>

            <div className="rounded-lg border border-border-subtle bg-surface p-5 space-y-6 mb-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-mono text-[12px] text-[#EAEAEF] font-semibold">Minimum Profit</p>
                    <p className="font-mono text-[10px] text-ghost">Filter out low-value signals</p>
                  </div>
                  <span className="font-mono text-[22px] font-bold text-signal">${minProfit}</span>
                </div>
                <input type="range" min={0} max={200} step={5} value={minProfit} onChange={e => setMinProfit(Number(e.target.value))} className="w-full h-1 bg-elevated rounded cursor-pointer accent-signal" />
                <div className="flex justify-between mt-1">
                  <span className="font-mono text-[10px] text-ghost">$0 — Show all</span>
                  <span className="font-mono text-[10px] text-ghost">$200</span>
                </div>
              </div>

              <div className="border-t border-border-subtle pt-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-mono text-[12px] text-[#EAEAEF] font-semibold">Minimum Confidence</p>
                    <p className="font-mono text-[10px] text-ghost">Higher = fewer but more reliable signals</p>
                  </div>
                  <span className="font-mono text-[22px] font-bold text-signal">{minConfidence}%</span>
                </div>
                <input type="range" min={0} max={100} step={5} value={minConfidence} onChange={e => setMinConfidence(Number(e.target.value))} className="w-full h-1 bg-elevated rounded cursor-pointer accent-signal" />
                <div className="flex justify-between mt-1">
                  <span className="font-mono text-[10px] text-ghost">0% — Show all</span>
                  <span className="font-mono text-[10px] text-ghost">100%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 h-10 rounded border border-border-subtle font-mono text-[13px] text-secondary hover:text-[#EAEAEF] transition-colors">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 h-10 rounded border border-signal/50 bg-signal/5 text-signal font-mono font-semibold text-[13px] hover:bg-signal/10 transition-all flex items-center justify-center gap-2">
                Continue <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-[32px] text-[#EAEAEF] mb-2">Connect Discord</h1>
            <p className="text-secondary text-[14px] mb-6">Get real-time alerts in your Discord server when high-confidence signals are detected. Optional — you can always add this later.</p>

            <div className="rounded-lg border border-border-subtle bg-surface p-5 mb-4">
              <label className="font-mono text-[11px] text-ghost uppercase tracking-wider block mb-2">Webhook URL</label>
              <input
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={discordUrl}
                onChange={e => setDiscordUrl(e.target.value)}
                className="w-full h-9 px-3 bg-elevated border border-border-subtle rounded font-mono text-[12px] text-[#EAEAEF] placeholder:text-ghost focus:border-border-hover focus:outline-none transition-colors"
              />
              <p className="font-mono text-[10px] text-ghost mt-2">Server Settings → Integrations → Webhooks → New Webhook</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 h-10 rounded border border-border-subtle font-mono text-[13px] text-secondary hover:text-[#EAEAEF] transition-colors">Back</button>
              <button onClick={() => setStep(4)} className="flex-1 h-10 rounded border border-signal/50 bg-signal/5 text-signal font-mono font-semibold text-[13px] hover:bg-signal/10 transition-all flex items-center justify-center gap-2">
                {discordUrl ? 'Connect & Continue' : 'Skip for now'} <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full border border-signal/40 bg-signal/10 flex items-center justify-center mx-auto mb-6" style={{ boxShadow: '0 0 30px rgba(0,255,136,0.2)' }}>
              <Zap size={28} className="text-signal" fill="currentColor" />
            </div>
            <h1 className="font-serif text-[36px] text-[#EAEAEF] mb-3">You&apos;re in.</h1>
            <p className="text-secondary text-[16px] mb-2 max-w-sm mx-auto">
              Wraith is now scanning 50,000+ listings for you. Your first signals are ready.
            </p>
            <p className="font-mono text-[12px] text-ghost mb-8">
              {categories.length} categories • ${minProfit}+ profit • {minConfidence}%+ confidence
            </p>
            <button
              onClick={finish}
              disabled={revealing}
              className="h-12 px-10 rounded border border-signal/60 bg-signal/5 text-signal font-mono font-bold text-[15px] hover:bg-signal/10 hover:border-signal transition-all flex items-center gap-2 mx-auto disabled:opacity-60"
              style={{ boxShadow: '0 0 24px rgba(0,255,136,0.15)' }}
            >
              {revealing ? (
                <><span className="w-4 h-4 border border-signal border-t-transparent rounded-full animate-spin" /> Loading signals...</>
              ) : (
                <>See my signals <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
