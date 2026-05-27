'use client';

import { MOCK_SIGNALS } from '@/lib/mock-data';
import { formatCurrency, getPlatformLabel } from '@/lib/utils';

export default function LiveTicker() {
  const items = MOCK_SIGNALS.filter(s => s.confidence >= 75).slice(0, 16);
  const tape = [...items, ...items]; // duplicate for seamless scroll

  return (
    <div className="relative h-7 border-b border-border-subtle bg-void overflow-hidden">
      <div className="absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-void to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-void to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 left-0 z-20 px-3 flex items-center bg-signal/10 border-r border-signal/20">
        <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse-fast mr-1.5" />
        <span className="font-mono text-[9px] text-signal font-bold tracking-wider">LIVE</span>
      </div>
      <div className="h-full flex items-center animate-tape-scroll whitespace-nowrap" style={{ paddingLeft: '60px', width: 'max-content' }}>
        {tape.map((s, i) => (
          <span key={`${s.id}-${i}`} className="inline-flex items-center gap-1.5 px-3 font-mono text-[10px] border-r border-border-subtle/40 h-full">
            <span className="text-ghost truncate max-w-[200px]">{s.itemName}</span>
            <span className="text-secondary">{getPlatformLabel(s.buyPlatform)}→{getPlatformLabel(s.sellPlatform)}</span>
            <span className="text-signal font-semibold">{formatCurrency(s.profit)}</span>
            <span className="text-ghost">·</span>
            <span className="text-secondary">{s.confidence}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}
