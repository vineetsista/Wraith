'use client';

import { useState } from 'react';
import { Star, Check, Share2, Sparkles } from 'lucide-react';
import { Signal } from '@/types';
import { useAssistant } from '@/lib/assistant-context';
import { useActivity } from '@/lib/activity-context';
import { cn, formatCurrency } from '@/lib/utils';

export default function SignalDetailActions({ signal }: { signal: Signal }) {
  const [watched, setWatched] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const { prefill } = useAssistant();
  const { push } = useActivity();

  function toggleWatch() {
    const next = !watched;
    setWatched(next);
    push({
      kind: next ? 'watchlist_added' : 'system',
      title: next ? `Watching ${signal.itemName}` : `Removed from watchlist`,
      body: next ? `You'll get an alert if confidence shifts or profit drops 10%` : undefined,
    });
  }

  function toggleFlip() {
    const next = !flipped;
    setFlipped(next);
    if (next) {
      push({
        kind: 'flip_marked',
        title: `Flip logged: ${signal.itemName}`,
        body: `Estimated profit ${formatCurrency(signal.profit)} added to portfolio`,
      });
    }
  }

  function shareSignal() {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).catch(() => undefined);
      push({ kind: 'system', title: 'Link copied to clipboard' });
    }
  }

  function askAi() {
    prefill(`Should I buy the ${signal.itemName} signal? Walk me through the risk.`);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={toggleWatch}
        className={cn(
          'flex-1 min-w-[140px] h-9 rounded border font-mono text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5',
          watched
            ? 'border-gold/40 bg-gold/10 text-gold'
            : 'border-signal/30 bg-signal/5 text-signal hover:bg-signal/10 hover:border-signal/50',
        )}
      >
        <Star size={12} fill={watched ? 'currentColor' : 'none'} /> {watched ? 'Watching' : 'Add to Watchlist'}
      </button>
      <button
        onClick={toggleFlip}
        className={cn(
          'flex-1 min-w-[140px] h-9 rounded border font-mono text-[12px] transition-colors flex items-center justify-center gap-1.5',
          flipped
            ? 'border-signal/40 bg-signal/15 text-signal'
            : 'border-border-hover bg-elevated text-[#EAEAEF] hover:bg-surface',
        )}
      >
        <Check size={12} /> {flipped ? 'Flip Logged' : 'Mark as Flipped'}
      </button>
      <button
        onClick={askAi}
        title="Ask Wraith about this signal"
        className="h-9 px-3 rounded border border-signal/30 bg-signal/5 text-signal hover:bg-signal/10 transition-colors flex items-center justify-center gap-1.5"
      >
        <Sparkles size={12} /> <span className="hidden sm:inline font-mono text-[11px]">Ask Wraith</span>
      </button>
      <button
        onClick={shareSignal}
        title="Copy share link"
        className="h-9 w-9 rounded border border-border-subtle bg-elevated text-ghost hover:text-[#EAEAEF] transition-colors flex items-center justify-center"
      >
        <Share2 size={12} />
      </button>
    </div>
  );
}
