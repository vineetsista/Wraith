'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

const HEADLINE = 'See the spread before anyone else.';
const PLATFORMS = ['StockX', 'GOAT', 'eBay', 'Mercari', 'Grailed'];

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.05,
      pulse: Math.random() * Math.PI * 2,
    }));

    let animId: number;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.01;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const opacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`;
        ctx.fill();
      });

      // Draw subtle connecting lines
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.03 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

function TypewriterHeadline({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        clearInterval(interval);
      }
    }, 55);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={done ? '' : 'typewriter-cursor'}>
      {displayed}
    </span>
  );
}

export default function LandingHero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-14">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Particle field */}
      <ParticleField />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0, 255, 136, 0.06) 0%, transparent 70%)' }}
      />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full border border-signal/20 bg-signal/5"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse-fast" />
          <span className="font-mono text-[11px] text-signal tracking-widest uppercase">Live Intelligence</span>
          <span className="font-mono text-[11px] text-ghost">50,000+ listings scanned</span>
        </div>

        {/* Logo + Brand */}
        <div
          className="flex items-center justify-center gap-3 mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
          }}
        >
          <div className="w-10 h-10 rounded-lg border border-signal/30 flex items-center justify-center bg-signal/5">
            <Zap size={20} className="text-signal" fill="currentColor" />
          </div>
          <span className="font-serif text-[28px] text-[#EAEAEF]">Wraith</span>
        </div>

        {/* Main headline */}
        <h1
          className="text-[48px] md:text-[64px] lg:text-[76px] font-serif leading-[1.05] tracking-tight text-[#EAEAEF] mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.2s',
          }}
        >
          {visible && <TypewriterHeadline text={HEADLINE} />}
        </h1>

        {/* Subtitle */}
        <p
          className="text-[17px] md:text-[19px] text-secondary max-w-xl mx-auto mb-10 leading-relaxed"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease 1.8s, transform 0.6s ease 1.8s',
          }}
        >
          AI-powered arbitrage signals for sneakers, streetwear, and collectibles.
          Real-time intelligence that finds money before the market does.
        </p>

        {/* CTA group */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease 2.0s, transform 0.6s ease 2.0s',
          }}
        >
          <Link
            href="/dashboard"
            className="group h-12 px-8 flex items-center gap-2.5 rounded border border-signal/60 text-signal font-mono font-semibold text-[14px] hover:bg-signal/10 hover:border-signal transition-all"
            style={{
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
              letterSpacing: '0.03em',
            }}
          >
            Launch the demo
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="https://github.com/vineetsista/Wraith"
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 px-8 flex items-center gap-2 rounded border border-border-hover text-[#EAEAEF] font-mono font-medium text-[14px] hover:bg-elevated transition-all"
          >
            View on GitHub
          </a>
        </div>

        {/* Platform trust line */}
        <div
          className="flex flex-col items-center gap-3"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease 2.2s',
          }}
        >
          <p className="font-mono text-[11px] text-ghost uppercase tracking-widest">
            Scanning across
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {PLATFORMS.map((platform, i) => (
              <span
                key={platform}
                className="font-mono text-[11px] text-secondary border border-border-subtle px-2 py-0.5 rounded"
                style={{
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.4s ease ${2.3 + i * 0.08}s`,
                }}
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(transparent, #050507)' }} />
    </section>
  );
}
