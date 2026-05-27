'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Clock, TrendingUp, Star } from 'lucide-react';
import { Signal } from '@/types';
import { formatCurrency, formatPercent, getPlatformLabel } from '@/lib/utils';
import { useAssistant } from '@/lib/assistant-context';
import PlatformBadge from './PlatformBadge';

export default function SignalSpotlight({ signal }: { signal: Signal }) {
  const { prefill } = useAssistant();
  if (!signal) return null;

  return (
    <div
      className="relative rounded-xl border border-signal/30 bg-gradient-to-br from-signal/[0.04] via-surface to-surface overflow-hidden mb-4"
      style={{ boxShadow: '0 0 0 1px rgba(0,255,136,0.1), 0 20px 50px rgba(0,255,136,0.05)' }}
    >
      {/* Animated scan line */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <div className="data-line h-px w-full bg-signal/30" />
      </div>

      <div className="relative grid lg:grid-cols-[1fr,auto] gap-4 p-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-signal bg-signal/10 border border-signal/30 px-2 py-0.5 rounded">
              <Sparkles size={9} /> WRAITH PICK · NOW
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-warning">
              <Clock size={9} /> Window closes in 3h 12m
            </span>
          </div>
          <Link href={`/dashboard/signal/${signal.id}`}>
            <h2 className="font-serif text-[26px] text-[#EAEAEF] leading-tight mb-1 hover:text-signal transition-colors">{signal.itemName}</h2>
          </Link>
          <p className="font-mono text-[11px] text-ghost mb-3 line-clamp-2 max-w-2xl">{signal.aiNarrative}</p>

          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-elevated rounded border border-border-subtle">
              <span className="font-mono text-[9px] text-ghost">BUY</span>
              <PlatformBadge platform={signal.buyPlatform} size="xs" />
              <span className="font-mono text-[12px] text-[#EAEAEF] font-semibold">{formatCurrency(signal.buyPrice)}</span>
            </div>
            <ArrowRight size={12} className="text-ghost" />
            <div className="flex items-center gap-1.5 px-2 py-1 bg-elevated rounded border border-border-subtle">
              <span className="font-mono text-[9px] text-ghost">SELL</span>
              <PlatformBadge platform={signal.sellPlatform} size="xs" />
              <span className="font-mono text-[12px] text-[#EAEAEF] font-semibold">{formatCurrency(signal.sellPrice)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/dashboard/signal/${signal.id}`} className="h-9 px-4 rounded border border-signal/40 bg-signal/10 text-signal font-mono text-[12px] font-semibold hover:bg-signal/20 transition-all flex items-center gap-1.5">
              Open signal <ArrowRight size={12} />
            </Link>
            <button
              onClick={() => prefill(`Why should I take the ${signal.itemName} signal right now?`)}
              className="h-9 px-3 rounded border border-border-subtle bg-elevated text-secondary hover:text-[#EAEAEF] font-mono text-[11px] flex items-center gap-1.5 transition-colors"
            >
              <Sparkles size={11} /> Ask Wraith
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end justify-center gap-2 lg:border-l lg:border-signal/15 lg:pl-5 min-w-[180px]">
          <p className="font-mono text-[9px] uppercase tracking-wider text-ghost">Net Profit</p>
          <p
            className="font-mono text-[44px] font-bold leading-none"
            style={{ color: '#00FF88', textShadow: '0 0 24px rgba(0,255,136,0.45), 0 0 60px rgba(0,255,136,0.15)' }}
          >
            {formatCurrency(signal.profit)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-[11px] text-signal">{formatPercent(signal.roi)} ROI</span>
            <span className="font-mono text-[11px] text-ghost">·</span>
            <span className="font-mono text-[11px] text-[#EAEAEF]">{signal.confidence}% conf</span>
          </div>
        </div>
      </div>
    </div>
  );
}
