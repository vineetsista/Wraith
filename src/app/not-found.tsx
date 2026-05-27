import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border border-border-subtle bg-surface flex items-center justify-center mx-auto mb-6">
          <Zap size={24} className="text-ghost" />
        </div>
        <p className="font-mono text-[11px] text-ghost uppercase tracking-widest mb-3">404 — NOT FOUND</p>
        <h1 className="font-serif text-[48px] text-[#EAEAEF] mb-4">Signal lost.</h1>
        <p className="text-secondary text-[15px] mb-8 max-w-sm">This page doesn&apos;t exist. Wraith is still scanning for you, though.</p>
        <Link href="/" className="h-10 px-6 rounded border border-signal/40 text-signal font-mono text-[13px] hover:bg-signal/10 transition-all inline-flex items-center">
          Return to base →
        </Link>
      </div>
    </div>
  );
}
