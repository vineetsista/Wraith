import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-void px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="font-mono text-[12px] text-secondary hover:text-[#EAEAEF] transition-colors mb-8 block">← Back</Link>
        <h1 className="font-serif text-[36px] text-[#EAEAEF] mb-4">Privacy Policy</h1>
        <p className="text-secondary text-[14px] mb-6">Last updated: 2026</p>
        <div className="space-y-4 text-secondary text-[14px] leading-relaxed">
          <p>Wraith is a personal, open-source project — there is no billing, no account requirement, and no data collected by a hosted backend. Sample data ships with the repository.</p>
          <p>If you run your own instance with a real database, you control what gets stored. Wraith ships with optional Discord webhook delivery; URLs are stored locally in your instance only.</p>
          <p>No analytics, telemetry, or third-party trackers run in this app. The full source is on GitHub at <a href="https://github.com/vineetsista/Wraith" className="text-signal hover:underline">github.com/vineetsista/Wraith</a>.</p>
        </div>
      </div>
    </div>
  );
}
