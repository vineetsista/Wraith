'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, ArrowRight, Check, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWraith, ADMIN_EMAIL } from '@/lib/wraith-context';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ chars', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['transparent', '#FF3D57', '#FFB800', '#00FF88'];

  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="flex-1 h-0.5 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : 'rgba(255,255,255,0.06)' }}
          />
        ))}
      </div>
      <div className="flex gap-3">
        {checks.map(c => (
          <span key={c.label} className={cn('font-mono text-[10px] flex items-center gap-0.5', c.pass ? 'text-signal' : 'text-ghost')}>
            {c.pass && <Check size={9} />}{c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn } = useWraith();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!email.trim()) {
      setError('Email required. (Any password works in demo mode.)');
      setLoading(false);
      return;
    }
    await new Promise(r => setTimeout(r, 800));
    signIn(email);
    router.push('/auth/onboarding');
    setLoading(false);
  }

  function quickStart() {
    signIn(ADMIN_EMAIL);
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,255,136,0.04) 0%, transparent 70%)' }} />
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg border border-signal/40 flex items-center justify-center bg-signal/5">
              <Zap size={18} className="text-signal" fill="currentColor" />
            </div>
            <span className="font-serif text-[22px] text-[#EAEAEF]">Wraith</span>
          </Link>
          <p className="font-mono text-[12px] text-ghost mt-3">Demo signup · open-source · no payment ever</p>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface p-6">
          {/* Skip-to-dashboard demo */}
          <button
            type="button"
            onClick={quickStart}
            className="w-full h-10 rounded border border-warning/30 bg-warning/5 font-mono text-[12px] font-semibold text-warning hover:bg-warning/10 transition-colors flex items-center justify-center gap-2 mb-4"
          >
            <Shield size={12} /> Skip — launch demo as admin
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="font-mono text-[10px] text-ghost">or create your own demo profile</span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="font-mono text-[11px] text-ghost uppercase tracking-wider block mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full h-9 px-3 bg-elevated border border-border-subtle rounded font-mono text-[13px] text-[#EAEAEF] placeholder:text-ghost focus:border-border-hover focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-[11px] text-ghost uppercase tracking-wider block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-9 px-3 bg-elevated border border-border-subtle rounded font-mono text-[13px] text-[#EAEAEF] placeholder:text-ghost focus:border-border-hover focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-[11px] text-ghost uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="anything works in demo"
                  className="w-full h-9 px-3 pr-10 bg-elevated border border-border-subtle rounded font-mono text-[13px] text-[#EAEAEF] placeholder:text-ghost focus:border-border-hover focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ghost hover:text-secondary transition-colors"
                >
                  {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              {password && <PasswordStrength password={password} />}
            </div>

            {error && (
              <p className="font-mono text-[11px] text-warning bg-warning/10 border border-warning/20 rounded px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded border border-signal/50 bg-signal/5 text-signal font-mono font-semibold text-[13px] hover:bg-signal/10 hover:border-signal transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
            >
              {loading ? (
                <span className="w-4 h-4 border border-signal border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={13} /></>
              )}
            </button>
          </form>

          <p className="text-center font-mono text-[10px] text-ghost mt-4 leading-relaxed">
            By signing up you agree to our{' '}
            <Link href="/terms" className="text-secondary hover:text-[#EAEAEF] transition-colors">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-secondary hover:text-[#EAEAEF] transition-colors">Privacy Policy</Link>
          </p>
        </div>

        <p className="text-center font-mono text-[12px] text-ghost mt-4">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-secondary hover:text-[#EAEAEF] transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
