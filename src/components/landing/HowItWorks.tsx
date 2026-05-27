'use client';

import { useEffect, useRef, useState } from 'react';
import { Radar, Cpu, TrendingUp } from 'lucide-react';

const STEPS = [
  {
    icon: Radar,
    title: 'Wraith scans',
    description: 'Every 15 minutes, our AI scans 50,000+ listings across 5 platforms for price discrepancies, motivated sellers, and supply/demand imbalances.',
    number: '01',
    detail: '50,000+ listings per scan',
  },
  {
    icon: Cpu,
    title: 'AI detects edges',
    description: 'Machine learning identifies arbitrage opportunities, price trends, and social momentum signals — including TikTok spikes before they hit mainstream.',
    number: '02',
    detail: 'Signals scored 0-100',
  },
  {
    icon: TrendingUp,
    title: 'You profit',
    description: 'Real-time alerts with confidence scores tell you exactly what to buy, where to buy it, and when to sell — down to the hour.',
    number: '03',
    detail: 'Avg $67 profit per signal',
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={ref} className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-[11px] text-ghost uppercase tracking-widest mb-3">HOW IT WORKS</p>
          <h2 className="font-serif text-[40px] md:text-[48px] text-[#EAEAEF] leading-tight">
            Three steps to an unfair advantage
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-12 left-[22%] right-[22%] h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-lg border border-border-subtle bg-surface p-6"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`,
                }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 rounded-lg border border-signal/20 bg-signal/5 flex items-center justify-center">
                    <Icon size={18} className="text-signal" />
                  </div>
                  <span className="font-mono text-[40px] font-bold leading-none" style={{ color: 'rgba(255,255,255,0.04)' }}>
                    {step.number}
                  </span>
                </div>
                <h3 className="font-semibold text-[18px] text-[#EAEAEF] mb-3">{step.title}</h3>
                <p className="text-secondary text-[14px] leading-relaxed mb-4">{step.description}</p>
                <div className="border-t border-border-subtle pt-3">
                  <span className="font-mono text-[11px] text-signal">{step.detail}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
