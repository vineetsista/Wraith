'use client';

import { useEffect, useState } from 'react';

const SYMBOLS = ['$', '💰', '💵', '+$67', '+$182', '+$96', '+$41', '+$245', '$$', 'BUY', 'FLIP'];

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  symbol: string;
  size: number;
  drift: number;
}

let pidCounter = 0;

export default function MoneyMode() {
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    function trigger() {
      const next: Particle[] = Array.from({ length: 60 }, () => ({
        id: ++pidCounter,
        left: Math.random() * 100,
        delay: Math.random() * 600,
        duration: 2200 + Math.random() * 1800,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        size: 14 + Math.random() * 22,
        drift: (Math.random() - 0.5) * 80,
      }));
      setParticles(next);
      setActive(true);
      setTimeout(() => {
        setActive(false);
        setParticles([]);
      }, 4500);
    }

    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const inField = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;
      // Shift+M or $ key activates money mode
      if (!inField && ((e.shiftKey && e.key.toLowerCase() === 'm') || e.key === '$')) {
        e.preventDefault();
        trigger();
      }
    }

    window.addEventListener('keydown', onKey);
    window.addEventListener('wraith:money-mode', trigger as EventListener);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wraith:money-mode', trigger as EventListener);
    };
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute font-mono font-bold animate-money-fall"
          style={{
            left: `${p.left}%`,
            top: '-40px',
            fontSize: `${p.size}px`,
            color: '#00FF88',
            textShadow: '0 0 8px rgba(0,255,136,0.6), 0 0 16px rgba(0,255,136,0.3)',
            animationDelay: `${p.delay}ms`,
            animationDuration: `${p.duration}ms`,
            ['--drift' as any]: `${p.drift}px`,
          } as React.CSSProperties}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
