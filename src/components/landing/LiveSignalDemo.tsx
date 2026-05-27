'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';
import SignalCard from '@/components/signals/SignalCard';
import { MOCK_SIGNALS } from '@/lib/mock-data';

const DEMO_SIGNALS = MOCK_SIGNALS.slice(0, 4);

export default function LiveSignalDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          setVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleCount(count);
      if (count >= DEMO_SIGNALS.length) clearInterval(interval);
    }, 350);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <section ref={ref} className="py-24 px-6 relative overflow-hidden">
      {/* Section background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #050507 0%, rgba(0,255,136,0.02) 50%, #050507 100%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-border-subtle bg-elevated">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse-fast" />
            <span className="font-mono text-[11px] text-secondary tracking-widest uppercase">Live Signal Feed</span>
          </div>
          <h2 className="font-serif text-[42px] md:text-[52px] text-[#EAEAEF] leading-tight mb-4">
            Real opportunities.
            <span className="text-signal"> Right now.</span>
          </h2>
          <p className="text-secondary text-[16px] max-w-md mx-auto">
            This is what Wraith looks like inside. Every signal is a real arbitrage window — money waiting to be captured.
          </p>
        </div>

        {/* Signal cards */}
        <div className="space-y-3 relative">
          {DEMO_SIGNALS.map((signal, i) => (
            <div
              key={signal.id}
              style={{
                opacity: i < visibleCount ? 1 : 0,
                transform: i < visibleCount ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                filter: i === 3 ? 'blur(2px)' : 'none',
                pointerEvents: i === 3 ? 'none' : 'auto',
              }}
            >
              <SignalCard signal={signal} compact={false} />
            </div>
          ))}

          {/* Frosted glass CTA overlay on last card */}
          {visibleCount >= DEMO_SIGNALS.length && (
            <div
              className="absolute bottom-0 left-0 right-0 h-48 flex flex-col items-center justify-end pb-6 animate-fade-in"
              style={{
                background: 'linear-gradient(transparent 0%, rgba(5,5,7,0.8) 40%, rgba(5,5,7,0.95) 100%)',
              }}
            >
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-3">
                  <Lock size={14} className="text-ghost" />
                  <span className="font-mono text-[12px] text-ghost">
                    +26 more signals waiting in the demo
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 h-10 px-6 rounded border border-signal/50 text-signal font-mono font-semibold text-[13px] hover:bg-signal/10 hover:border-signal transition-all"
                  style={{ boxShadow: '0 0 20px rgba(0,255,136,0.1)' }}
                >
                  Launch the demo to see them all
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-12 border-t border-border-subtle pt-8">
          {[
            { label: 'Avg Profit / Signal', value: '$67', sub: 'across all categories' },
            { label: 'Signals Today', value: '142', sub: 'active right now' },
            { label: 'Platforms Scanned', value: '5', sub: 'every 15 minutes' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-[28px] font-bold text-signal mb-1">{stat.value}</div>
              <div className="text-[12px] font-semibold text-[#EAEAEF] mb-0.5">{stat.label}</div>
              <div className="font-mono text-[10px] text-ghost">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
