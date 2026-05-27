import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-void px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="font-mono text-[12px] text-secondary hover:text-[#EAEAEF] transition-colors mb-8 block">← Back</Link>
        <h1 className="font-serif text-[36px] text-[#EAEAEF] mb-4">Terms of Use</h1>
        <p className="text-secondary text-[14px] mb-6">Last updated: 2026</p>
        <div className="space-y-4 text-secondary text-[14px] leading-relaxed">
          <p>Wraith is a personal, open-source project. The hosted demo is provided as-is for exploration and educational purposes only.</p>
          <p>Wraith is an intelligence/UX concept — it does not facilitate automated purchasing or market manipulation. Any buy/sell decisions are made solely by the user.</p>
          <p>The source code is released under the MIT license. You are free to use, modify, and redistribute it.</p>
          <p>Wraith makes no guarantees about profit, signal accuracy, or market outcomes. Sample data is illustrative; do not treat it as real-time market information.</p>
        </div>
      </div>
    </div>
  );
}
