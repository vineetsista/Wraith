'use client';

import { useState } from 'react';
import { ChevronDown, Star, Check, X, ArrowRight, TrendingUp } from 'lucide-react';
import { Signal } from '@/types';
import { formatCurrency, formatPercent, getCategoryLabel, getPlatformLabel, getSignalTypeConfig, timeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';
import ConfidenceGauge from './ConfidenceGauge';
import PlatformBadge from './PlatformBadge';
import UrgencyBadge from './UrgencyBadge';

interface SignalCardProps {
  signal: Signal;
  onWatchlist?: (id: string) => void;
  onFlip?: (id: string) => void;
  onDismiss?: (id: string) => void;
  isWatched?: boolean;
  isFlipped?: boolean;
  animateIn?: boolean;
  compact?: boolean;
  className?: string;
}

export default function SignalCard({
  signal,
  onWatchlist,
  onFlip,
  onDismiss,
  isWatched = false,
  isFlipped = false,
  animateIn = false,
  compact = false,
  className,
}: SignalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [watched, setWatched] = useState(isWatched);
  const [flipped, setFlipped] = useState(isFlipped);

  const typeConfig = getSignalTypeConfig(signal.signalType);
  const borderGlowColor =
    signal.urgency === 'act_now' ? 'rgba(255, 61, 87, 0.3)' :
    signal.confidence >= 85 ? 'rgba(0, 255, 136, 0.2)' :
    'rgba(255, 255, 255, 0.06)';

  const hoverBorderColor =
    signal.urgency === 'act_now' ? 'rgba(255, 61, 87, 0.5)' :
    signal.confidence >= 85 ? 'rgba(0, 255, 136, 0.35)' :
    'rgba(255, 255, 255, 0.12)';

  function handleWatchlist() {
    setWatched(!watched);
    onWatchlist?.(signal.id);
  }

  function handleFlip() {
    setFlipped(!flipped);
    onFlip?.(signal.id);
  }

  return (
    <article
      className={cn(
        'signal-card group relative rounded-lg overflow-hidden',
        'bg-surface',
        animateIn && 'animate-slide-in-right',
        className
      )}
      style={{
        border: `1px solid ${borderGlowColor}`,
        transition: 'border-color 0.2s ease, transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = hoverBorderColor;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.5), 0 0 0 0.5px ${hoverBorderColor}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = borderGlowColor;
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      {/* Top accent line for act_now */}
      {signal.urgency === 'act_now' && (
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #FF3D57, transparent)' }} />
      )}
      {signal.confidence >= 90 && signal.urgency !== 'act_now' && (
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #00FF88, transparent)' }} />
      )}

      <div className={cn('flex items-stretch gap-0', compact ? 'min-h-[80px]' : 'min-h-[100px]')}>
        {/* Item image / gradient */}
        <div
          className={cn(
            'flex-shrink-0 flex items-center justify-center relative overflow-hidden',
            compact ? 'w-16' : 'w-20'
          )}
          style={{
            background: `linear-gradient(135deg, var(--start), var(--end))`,
          }}
        >
          <div
            className={cn('w-full h-full bg-gradient-to-br', signal.imageGradient || 'from-gray-800 to-gray-950')}
          />
          {/* Category overlay */}
          <div className="absolute inset-0 bg-black/20" />
          <span className="absolute text-[8px] font-mono text-white/50 uppercase tracking-widest bottom-1 left-0 right-0 text-center">
            {getCategoryLabel(signal.category).slice(0, 4)}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 px-4 py-3 flex flex-col justify-center min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span
                  className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border"
                  style={{ color: typeConfig.color, backgroundColor: typeConfig.bg, borderColor: typeConfig.color + '30' }}
                >
                  {typeConfig.label}
                </span>
                <UrgencyBadge urgency={signal.urgency} />
              </div>
              <h3 className="font-semibold text-[15px] leading-tight text-[#EAEAEF] truncate dense-text">
                {signal.itemName}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-ghost font-mono">{signal.brand}</span>
                {signal.size && (
                  <span className="text-[10px] text-ghost font-mono border border-border-subtle px-1 rounded">
                    SZ {signal.size}
                  </span>
                )}
                <span className="text-[10px] text-ghost font-mono">{timeAgo(signal.createdAt)}</span>
              </div>
            </div>

            {/* Confidence gauge */}
            <div className="flex-shrink-0">
              <ConfidenceGauge value={signal.confidence} size={compact ? 'sm' : 'md'} />
            </div>
          </div>

          {/* Platform spread */}
          {!compact && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-elevated rounded px-2 py-1 border border-border-subtle">
                <span className="text-[10px] text-ghost font-mono uppercase">BUY</span>
                <PlatformBadge platform={signal.buyPlatform} size="xs" />
                <span className="font-mono text-[13px] text-[#EAEAEF] font-semibold">
                  {formatCurrency(signal.buyPrice)}
                </span>
              </div>

              <ArrowRight size={12} className="text-ghost flex-shrink-0" />

              <div className="flex items-center gap-1.5 bg-elevated rounded px-2 py-1 border border-border-subtle">
                <span className="text-[10px] text-ghost font-mono uppercase">SELL</span>
                <PlatformBadge platform={signal.sellPlatform} size="xs" />
                <span className="font-mono text-[13px] text-[#EAEAEF] font-semibold">
                  {formatCurrency(signal.sellPrice)}
                </span>
              </div>

              <div className="flex items-center gap-1 ml-auto">
                <TrendingUp size={12} style={{ color: '#00FF88' }} />
                <span className="font-mono text-[11px] text-ghost">
                  {formatCurrency(signal.fees)} fees
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Profit column */}
        <div className={cn(
          'flex-shrink-0 flex flex-col items-end justify-center border-l border-border-subtle px-4 py-3 gap-1',
          compact ? 'min-w-[80px]' : 'min-w-[100px]'
        )}>
          <span
            className="font-mono font-bold leading-none"
            style={{
              color: '#00FF88',
              fontSize: compact ? '18px' : '22px',
              textShadow: '0 0 12px rgba(0, 255, 136, 0.4)',
            }}
          >
            {formatCurrency(signal.profit)}
          </span>
          <span className="font-mono text-[10px] text-ghost">
            {formatPercent(signal.roi)} ROI
          </span>

          {/* Action buttons */}
          {!compact && (
            <div className="flex items-center gap-1 mt-2">
              <button
                onClick={handleWatchlist}
                title={watched ? 'Remove from watchlist' : 'Add to watchlist'}
                className={cn(
                  'w-6 h-6 rounded flex items-center justify-center border transition-colors',
                  watched
                    ? 'border-gold/40 bg-gold/10 text-gold'
                    : 'border-border-subtle bg-elevated text-ghost hover:text-gold hover:border-gold/30'
                )}
              >
                <Star size={11} fill={watched ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleFlip}
                title={flipped ? 'Unmark flip' : 'Mark as flipped'}
                className={cn(
                  'w-6 h-6 rounded flex items-center justify-center border transition-colors',
                  flipped
                    ? 'border-signal/40 bg-signal/10 text-signal'
                    : 'border-border-subtle bg-elevated text-ghost hover:text-signal hover:border-signal/30'
                )}
              >
                <Check size={11} />
              </button>
              <button
                onClick={() => onDismiss?.(signal.id)}
                title="Dismiss signal"
                className="w-6 h-6 rounded flex items-center justify-center border border-border-subtle bg-elevated text-ghost hover:text-warning hover:border-warning/30 transition-colors"
              >
                <X size={11} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expand toggle */}
      {!compact && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-2 border-t border-border-subtle text-ghost hover:text-[#EAEAEF] transition-colors"
          style={{ background: 'rgba(255,255,255,0.01)' }}
        >
          <span className="text-[10px] font-mono uppercase tracking-wider">AI Analysis</span>
          <ChevronDown
            size={12}
            className={cn('transition-transform duration-200', expanded && 'rotate-180')}
          />
        </button>
      )}

      {/* Expanded AI narrative */}
      {!compact && expanded && (
        <div className="px-4 pb-4 border-t-0 animate-fade-in">
          <p className="text-[13px] leading-relaxed text-secondary mt-3">
            {signal.aiNarrative}
          </p>
          {signal.tiktokMentions && (
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-ghost uppercase tracking-wider">TikTok</span>
                <span className="font-mono text-[11px] text-gold">{signal.tiktokMentions.toLocaleString()} mentions</span>
              </div>
              {signal.socialScore && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-ghost uppercase tracking-wider">Social</span>
                  <span className="font-mono text-[11px] text-blue">{signal.socialScore}/100</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
