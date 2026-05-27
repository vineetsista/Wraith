import Link from 'next/link';

export default function SignalNotFound() {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-mono text-[11px] text-ghost uppercase tracking-widest mb-3">SIGNAL NOT FOUND</p>
        <h1 className="font-serif text-[40px] text-[#EAEAEF] mb-4">This signal expired.</h1>
        <p className="text-secondary text-[14px] mb-8">This opportunity no longer exists. Wraith has 30+ active signals waiting.</p>
        <Link href="/dashboard" className="h-10 px-6 rounded border border-signal/40 text-signal font-mono text-[13px] hover:bg-signal/10 transition-all inline-flex items-center">
          View active signals →
        </Link>
      </div>
    </div>
  );
}
