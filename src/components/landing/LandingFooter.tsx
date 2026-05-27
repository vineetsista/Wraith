import Link from 'next/link';
import { Zap, Github } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="border-t border-border-subtle py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-signal/30 flex items-center justify-center bg-signal/5">
              <Zap size={12} className="text-signal" fill="currentColor" />
            </div>
            <span className="font-serif text-[16px] text-[#EAEAEF]">Wraith</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-mono text-[12px] text-secondary hover:text-[#EAEAEF] transition-colors">Demo</Link>
            <a href="https://github.com/vineetsista/Wraith" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-mono text-[12px] text-secondary hover:text-[#EAEAEF] transition-colors">
              <Github size={11} /> Source
            </a>
            <Link href="/terms" className="font-mono text-[12px] text-secondary hover:text-[#EAEAEF] transition-colors">Terms</Link>
            <Link href="/privacy" className="font-mono text-[12px] text-secondary hover:text-[#EAEAEF] transition-colors">Privacy</Link>
          </div>

          <p className="font-mono text-[11px] text-ghost">
            Personal project by{' '}
            <a href="https://github.com/vineetsista" target="_blank" rel="noopener noreferrer" className="hover:text-[#EAEAEF] transition-colors">@vineetsista</a>
            {' · '}MIT
          </p>
        </div>
      </div>
    </footer>
  );
}
