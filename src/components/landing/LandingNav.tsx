'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Zap, Github } from 'lucide-react';

export default function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle" style={{ background: 'rgba(5, 5, 7, 0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-7 h-7 rounded border border-signal/40 flex items-center justify-center bg-signal/5 group-hover:bg-signal/10 transition-colors">
              <Zap size={14} className="text-signal" fill="currentColor" />
            </div>
            <div className="absolute inset-0 rounded blur-sm bg-signal/10 group-hover:bg-signal/20 transition-colors" />
          </div>
          <span className="font-serif text-[19px] text-[#EAEAEF] tracking-tight">Wraith</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-secondary hover:text-[#EAEAEF] text-[13px] font-medium transition-colors">How It Works</a>
          <a href="#pricing" className="text-secondary hover:text-[#EAEAEF] text-[13px] font-medium transition-colors">The Project</a>
          <a href="#faq" className="text-secondary hover:text-[#EAEAEF] text-[13px] font-medium transition-colors">FAQ</a>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/vineetsista/Wraith"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] font-mono text-secondary hover:text-[#EAEAEF] transition-colors"
          >
            <Github size={13} /> Source
          </a>
          <Link
            href="/dashboard"
            className="h-8 px-4 text-[12px] font-mono font-semibold rounded border border-signal/50 text-signal hover:bg-signal/10 hover:border-signal transition-all flex items-center gap-1.5"
            style={{ letterSpacing: '0.02em' }}
          >
            Launch demo →
          </Link>
        </div>

        {/* Mobile menu */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-secondary hover:text-[#EAEAEF] transition-colors">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border-subtle bg-void px-6 py-4 flex flex-col gap-4">
          <a href="#how-it-works" className="text-secondary text-[14px] font-medium" onClick={() => setOpen(false)}>How It Works</a>
          <a href="#pricing" className="text-secondary text-[14px] font-medium" onClick={() => setOpen(false)}>The Project</a>
          <a href="#faq" className="text-secondary text-[14px] font-medium" onClick={() => setOpen(false)}>FAQ</a>
          <a href="https://github.com/vineetsista/Wraith" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-secondary text-[14px] font-medium" onClick={() => setOpen(false)}>
            <Github size={14} /> Source
          </a>
          <Link
            href="/dashboard"
            className="h-10 px-4 text-[13px] font-mono font-semibold rounded border border-signal/50 text-signal hover:bg-signal/10 flex items-center justify-center"
            onClick={() => setOpen(false)}
          >
            Launch demo →
          </Link>
        </div>
      )}
    </nav>
  );
}
