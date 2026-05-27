'use client';

import { useEffect, useRef, useState } from 'react';

const CATEGORIES = [
  { icon: '👟', label: 'Sneakers', count: '18,400+', description: 'Jordan, Nike, Adidas, NB, ASICS' },
  { icon: '🧥', label: 'Streetwear', count: '12,200+', description: 'Supreme, Stüssy, Palace, Bape' },
  { icon: '🃏', label: 'Trading Cards', count: '9,800+', description: 'Pokémon, NBA Prizm, One Piece, MTG' },
  { icon: '🕰️', label: 'Vintage', count: '4,600+', description: 'Luxury accessories, vintage garments' },
  { icon: '📱', label: 'Electronics', count: '3,200+', description: 'Sealed Apple, Sony, limited tech' },
  { icon: '🎯', label: 'Collectibles', count: '2,800+', description: 'GPK, comics, signed memorabilia' },
];

export default function WhatWraithTracks() {
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
    <section ref={ref} className="py-24 px-6 border-t border-border-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] text-ghost uppercase tracking-widest mb-3">COVERAGE</p>
          <h2 className="font-serif text-[40px] md:text-[48px] text-[#EAEAEF] leading-tight mb-4">
            Everything that resells
          </h2>
          <p className="text-secondary text-[15px] max-w-md mx-auto">
            Wraith covers every major resale category. If it has a secondary market, we&apos;re scanning it.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.label}
              className="group rounded-lg border border-border-subtle bg-surface p-5 hover:border-border-hover hover:bg-elevated transition-all duration-200 cursor-default"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`,
              }}
            >
              <div className="text-2xl mb-3 grayscale group-hover:grayscale-0 transition-all duration-300">
                {cat.icon}
              </div>
              <h3 className="font-semibold text-[16px] text-[#EAEAEF] mb-1">{cat.label}</h3>
              <p className="font-mono text-[11px] text-signal mb-2">{cat.count} listings</p>
              <p className="text-[12px] text-ghost">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
