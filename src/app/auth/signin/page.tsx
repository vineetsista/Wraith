'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, ArrowRight, Shield } from 'lucide-react';
import { useWraith, ADMIN_EMAIL } from '@/lib/wraith-context';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn } = useWraith();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    if (!email.trim()) {
      setError('Please enter your email. (Any password works in demo mode.)');
      setLoading(false);
      return;
    }
    signIn(email);
    router.push('/dashboard');
    setLoading(false);
  }

  function quickSignIn(addr: string) {
    setEmail(addr);
    setPassword('demo-pass');
    signIn(addr);
    setTimeout(() => router.push('/dashboard'), 250);
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,255,136,0.04) 0%, transparent 70%)' }} />
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg border border-signal/40 flex items-center justify-center bg-signal/5">
              <Zap size={18} className="text-signal" fill="currentColor" />
            </div>
            <span className="font-serif text-[22px] text-[#EAEAEF]">Wraith</span>
          </Link>
          <p className="font-mono text-[12px] text-ghost mt-3">Sign in to your account</p>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface p-6">
          {/* Quick demo access */}
          <div className="mb-4 p-3 rounded border border-warning/25 bg-warning/5">
            <div className="flex items-center gap-1.5 mb-2">
              <Shield size={11} className="text-warning" />
              <p className="font-mono text-[10px] uppercase tracking-wider text-warning font-semibold">Demo access</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => quickSignIn(ADMIN_EMAIL)}
                className="w-full text-left px-2.5 py-1.5 rounded border border-border-subtle bg-elevated hover:border-warning/30 hover:bg-warning/10 transition-colors group"
              >
                <p className="font-mono text-[11px] text-[#EAEAEF] group-hover:text-warning transition-colors">→ {ADMIN_EMAIL}</p>
                <p className="font-mono text-[9px] text-ghost">Admin (you) · full console + demo controls</p>
              </button>
              <button
                type="button"
                onClick={() => quickSignIn('reseller@nyc.com')}
                className="w-full text-left px-2.5 py-1.5 rounded border border-border-subtle bg-elevated hover:border-signal/30 hover:bg-signal/10 transition-colors group"
              >
                <p className="font-mono text-[11px] text-[#EAEAEF] group-hover:text-signal transition-colors">→ reseller@nyc.com</p>
                <p className="font-mono text-[9px] text-ghost">Standard user view</p>
              </button>
            </div>
          </div>

          {/* Google OAuth (demo) */}
          <button onClick={() => quickSignIn(ADMIN_EMAIL)} type="button" className="w-full h-10 rounded border border-border-hover bg-elevated font-mono text-[13px] text-[#EAEAEF] hover:bg-surface hover:border-border-hover transition-colors flex items-center justify-center gap-2 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="font-mono text-[10px] text-ghost">or</span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-[11px] text-ghost uppercase tracking-wider">Password</label>
                <Link href="/auth/reset" className="font-mono text-[10px] text-secondary hover:text-[#EAEAEF] transition-colors">Forgot?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="any password works"
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
                <>Sign in <ArrowRight size={13} /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-[12px] text-ghost mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-secondary hover:text-[#EAEAEF] transition-colors">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
