'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, Check } from 'lucide-react';

export default function ResetPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg border border-signal/40 flex items-center justify-center bg-signal/5">
              <Zap size={18} className="text-signal" fill="currentColor" />
            </div>
            <span className="font-serif text-[22px] text-[#EAEAEF]">Wraith</span>
          </Link>
          <p className="font-mono text-[12px] text-ghost mt-3">Reset your password</p>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full border border-signal/30 bg-signal/10 flex items-center justify-center mx-auto mb-4">
                <Check size={20} className="text-signal" />
              </div>
              <p className="font-mono text-[13px] text-[#EAEAEF] mb-2">Check your email</p>
              <p className="text-secondary text-[13px]">We sent a reset link to {email}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-mono text-[11px] text-ghost uppercase tracking-wider block mb-1.5">Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full h-9 px-3 bg-elevated border border-border-subtle rounded font-mono text-[13px] text-[#EAEAEF] placeholder:text-ghost focus:border-border-hover focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full h-10 rounded border border-signal/50 bg-signal/5 text-signal font-mono font-semibold text-[13px] hover:bg-signal/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <span className="w-4 h-4 border border-signal border-t-transparent rounded-full animate-spin" /> : <>Send Reset Link <ArrowRight size={13} /></>}
              </button>
            </form>
          )}
        </div>

        <p className="text-center font-mono text-[12px] text-ghost mt-4">
          <Link href="/auth/signin" className="text-secondary hover:text-[#EAEAEF] transition-colors">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
