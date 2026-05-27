'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, SlidersHorizontal, X, RefreshCw,
  TrendingUp, TrendingDown, Minus, Activity
} from 'lucide-react';
import { MOCK_SIGNALS, MOCK_ANALYTICS } from '@/lib/mock-data';
import { useSignals } from '@/hooks/useSignals';
import { useAnimateNumber } from '@/hooks/useAnimateNumber';
import SignalCard from '@/components/signals/SignalCard';
import SignalSpotlight from '@/components/signals/SignalSpotlight';
import SparklineChart from '@/components/charts/SparklineChart';
import { formatCurrency, formatPercent, timeAgo } from '@/lib/utils';
import { Category, Platform, SignalType, Urgency } from '@/types';
import { cn } from '@/lib/utils';
import { SignalCardSkeleton } from '@/components/ui/Skeleton';
import { useWraith } from '@/lib/wraith-context';

function MetricCard({
  label,
  value,
  sub,
  sparkline,
  trend,
  highlight,
  delay = 0,
}: {
  label: string;
  value: string;
  sub?: string;
  sparkline?: number[];
  trend?: 'up' | 'down' | 'flat';
  highlight?: boolean;
  delay?: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), delay); return () => clearTimeout(t); }, [delay]);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? '#00FF88' : trend === 'down' ? '#FF3D57' : '#3A3A48';

  return (
    <div
      className={cn(
        'rounded-lg border bg-surface p-4 flex flex-col gap-2',
        highlight ? 'border-signal/25' : 'border-border-subtle',
      )}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        boxShadow: highlight ? '0 0 20px rgba(0,255,136,0.05)' : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-ghost uppercase tracking-wider">{label}</span>
        {trend && <TrendIcon size={11} style={{ color: trendColor }} />}
      </div>
      <div className={cn('font-mono text-[22px] font-bold leading-none', highlight ? 'text-signal' : 'text-[#EAEAEF]')}>
        {value}
      </div>
      {sub && <span className="font-mono text-[10px] text-secondary truncate">{sub}</span>}
      {sparkline && (
        <div className="mt-1">
          <SparklineChart data={sparkline} height={24} width={100} />
        </div>
      )}
    </div>
  );
}

const CATEGORY_OPTIONS: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'sneakers', label: 'Sneakers' },
  { value: 'streetwear', label: 'Streetwear' },
  { value: 'trading_cards', label: 'Cards' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'collectibles', label: 'Collectibles' },
];

const PLATFORM_OPTIONS: { value: Platform | 'all'; label: string }[] = [
  { value: 'all', label: 'All Platforms' },
  { value: 'stockx', label: 'StockX' },
  { value: 'goat', label: 'GOAT' },
  { value: 'ebay', label: 'eBay' },
  { value: 'mercari', label: 'Mercari' },
  { value: 'grailed', label: 'Grailed' },
];

const TYPE_OPTIONS: { value: SignalType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'arbitrage', label: 'Arbitrage' },
  { value: 'price_prediction', label: 'Prediction' },
  { value: 'social_momentum', label: 'Social' },
  { value: 'sell_signal', label: 'Sell' },
];

const URGENCY_OPTIONS: { value: Urgency | 'all'; label: string }[] = [
  { value: 'all', label: 'All Urgency' },
  { value: 'act_now', label: 'Act Now' },
  { value: 'within_48hrs', label: '48 Hours' },
  { value: 'watch', label: 'Watch' },
];

const SORT_OPTIONS = [
  { value: 'confidence', label: 'By Confidence' },
  { value: 'profit', label: 'By Profit' },
  { value: 'newest', label: 'Newest' },
  { value: 'expiring', label: 'Expiring Soon' },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [scanTime, setScanTime] = useState(new Date());
  const { demoMode } = useWraith();

  const dataset = demoMode ? MOCK_SIGNALS : MOCK_SIGNALS.slice(0, 6);
  const {
    signals,
    filters,
    updateFilter,
    resetFilters,
    dismissSignal,
    toggleWatch,
    toggleFlip,
    watched,
    flipped,
    stats,
  } = useSignals(dataset);

  const bestSignal = dataset.find(s => s.confidence >= 90 && s.urgency === 'act_now') ?? dataset[0];
  const activeCount = useAnimateNumber(stats.total, 600, 100);
  const scannedCount = useAnimateNumber(47284, 1200, 200);
  const avgSpread = useAnimateNumber(67, 800, 300);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setScanTime(new Date()), 15000);
    return () => clearInterval(interval);
  }, []);

  const hasActiveFilters = filters.category !== 'all' || filters.platform !== 'all' ||
    filters.minProfit > 0 || filters.minConfidence > 0 ||
    filters.signalType !== 'all' || filters.urgency !== 'all' || filters.search;

  return (
    <div className="min-h-screen bg-void">
      {/* Data flow line at top */}
      <div className="data-line h-px w-full bg-border-subtle" />

      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Spotlight signal */}
        {bestSignal && !loading && <SignalSpotlight signal={bestSignal} />}

        {/* Metric strip */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          <MetricCard
            label="Active Signals"
            value={activeCount.toString()}
            sub="across all categories"
            sparkline={MOCK_ANALYTICS.weeklyTrends.slice(-7).map(t => t.signals)}
            trend="up"
            highlight
            delay={0}
          />
          <MetricCard
            label="Avg Spread"
            value={`$${avgSpread}`}
            sub="after fees this hour"
            sparkline={MOCK_ANALYTICS.weeklyTrends.slice(-7).map(t => t.avgSpread)}
            trend="up"
            delay={80}
          />
          <MetricCard
            label="Best Signal"
            value={bestSignal ? `$${bestSignal.profit}` : '—'}
            sub={bestSignal?.itemName?.slice(0, 22) || 'Loading...'}
            trend="up"
            delay={160}
          />
          <MetricCard
            label="Markets Scanned"
            value={scannedCount.toLocaleString()}
            sub={`last scan ${timeAgo(scanTime)}`}
            trend="flat"
            delay={240}
          />
          <MetricCard
            label="Your Flips"
            value={`$${flipped.size * 67}`}
            sub={`${flipped.size} flips tracked`}
            sparkline={[20, 35, 28, 45, 52, 48, 67]}
            trend={flipped.size > 0 ? 'up' : 'flat'}
            delay={320}
          />
        </div>

        {/* Filter bar */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[160px] max-w-xs">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost pointer-events-none" />
              <input
                type="text"
                placeholder="Search items..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full h-8 pl-8 pr-3 bg-surface border border-border-subtle rounded font-mono text-[12px] text-[#EAEAEF] placeholder:text-ghost focus:border-border-hover focus:outline-none transition-colors"
              />
            </div>

            {/* Category */}
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value as Category | 'all')}
              className="h-8 px-3 bg-surface border border-border-subtle rounded font-mono text-[12px] text-[#EAEAEF] focus:border-border-hover focus:outline-none transition-colors cursor-pointer"
            >
              {CATEGORY_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ background: '#0C0C10' }}>{o.label}</option>
              ))}
            </select>

            {/* Platform */}
            <select
              value={filters.platform}
              onChange={(e) => updateFilter('platform', e.target.value as Platform | 'all')}
              className="h-8 px-3 bg-surface border border-border-subtle rounded font-mono text-[12px] text-[#EAEAEF] focus:border-border-hover focus:outline-none transition-colors cursor-pointer"
            >
              {PLATFORM_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ background: '#0C0C10' }}>{o.label}</option>
              ))}
            </select>

            {/* Type */}
            <select
              value={filters.signalType}
              onChange={(e) => updateFilter('signalType', e.target.value as SignalType | 'all')}
              className="h-8 px-3 bg-surface border border-border-subtle rounded font-mono text-[12px] text-[#EAEAEF] focus:border-border-hover focus:outline-none transition-colors cursor-pointer hidden sm:block"
            >
              {TYPE_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ background: '#0C0C10' }}>{o.label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as any)}
              className="h-8 px-3 bg-surface border border-border-subtle rounded font-mono text-[12px] text-[#EAEAEF] focus:border-border-hover focus:outline-none transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ background: '#0C0C10' }}>{o.label}</option>
              ))}
            </select>

            {/* More filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'h-8 px-3 rounded border font-mono text-[12px] flex items-center gap-1.5 transition-colors',
                showFilters ? 'border-signal/30 bg-signal/10 text-signal' : 'border-border-subtle bg-surface text-secondary hover:text-[#EAEAEF]'
              )}
            >
              <SlidersHorizontal size={11} /> More
            </button>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="h-8 px-3 rounded border border-border-subtle bg-surface font-mono text-[12px] text-secondary hover:text-warning hover:border-warning/30 flex items-center gap-1.5 transition-colors"
              >
                <X size={11} /> Reset
              </button>
            )}

            {/* Signal count */}
            <div className="ml-auto flex items-center gap-2">
              <Activity size={11} className="text-ghost" />
              <span className="font-mono text-[11px] text-ghost">
                {stats.filtered} / {stats.total} signals
              </span>
            </div>
          </div>

          {/* Extended filters */}
          {showFilters && (
            <div className="flex items-center gap-2 flex-wrap p-3 bg-surface border border-border-subtle rounded-lg animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-ghost">Min profit:</span>
                <select
                  value={filters.minProfit}
                  onChange={(e) => updateFilter('minProfit', Number(e.target.value))}
                  className="h-7 px-2 bg-elevated border border-border-subtle rounded font-mono text-[11px] text-[#EAEAEF] focus:outline-none cursor-pointer"
                >
                  {[0, 20, 30, 50, 75, 100, 150, 200].map(v => (
                    <option key={v} value={v} style={{ background: '#141418' }}>${v}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-ghost">Min confidence:</span>
                <select
                  value={filters.minConfidence}
                  onChange={(e) => updateFilter('minConfidence', Number(e.target.value))}
                  className="h-7 px-2 bg-elevated border border-border-subtle rounded font-mono text-[11px] text-[#EAEAEF] focus:outline-none cursor-pointer"
                >
                  {[0, 50, 60, 70, 75, 80, 85, 90, 95].map(v => (
                    <option key={v} value={v} style={{ background: '#141418' }}>{v}%</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-ghost">Urgency:</span>
                <select
                  value={filters.urgency}
                  onChange={(e) => updateFilter('urgency', e.target.value as Urgency | 'all')}
                  className="h-7 px-2 bg-elevated border border-border-subtle rounded font-mono text-[11px] text-[#EAEAEF] focus:outline-none cursor-pointer"
                >
                  {URGENCY_OPTIONS.map(o => (
                    <option key={o.value} value={o.value} style={{ background: '#141418' }}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Signal feed */}
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SignalCardSkeleton key={i} />)
          ) : signals.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full border border-border-subtle bg-surface flex items-center justify-center mx-auto mb-4">
                <RefreshCw size={20} className="text-ghost" />
              </div>
              <p className="font-mono text-[13px] text-secondary mb-2">No signals match your filters</p>
              <p className="font-mono text-[11px] text-ghost mb-4">Wraith is scanning 47,000+ listings across 5 platforms</p>
              <button
                onClick={resetFilters}
                className="h-8 px-4 rounded border border-border-subtle font-mono text-[12px] text-secondary hover:text-[#EAEAEF] hover:border-border-hover transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            signals.map((signal, i) => (
              <div
                key={signal.id}
                style={{
                  opacity: loading ? 0 : 1,
                  animationDelay: `${i * 40}ms`,
                }}
              >
                <Link href={`/dashboard/signal/${signal.id}`} className="block" onClick={(e) => {
                  // Allow button clicks inside card to work without navigating
                  if ((e.target as HTMLElement).closest('button')) e.preventDefault();
                }}>
                  <SignalCard
                    signal={signal}
                    onWatchlist={toggleWatch}
                    onFlip={toggleFlip}
                    onDismiss={dismissSignal}
                    isWatched={watched.has(signal.id)}
                    isFlipped={flipped.has(signal.id)}
                    animateIn={i < 3 && !loading}
                  />
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        {signals.length > 0 && !loading && (
          <div className="text-center py-8 border-t border-border-subtle mt-6">
            <p className="font-mono text-[11px] text-ghost">
              Showing {signals.length} signals • Last scan {timeAgo(scanTime)} •{' '}
              <button onClick={() => window.scrollTo(0, 0)} className="text-blue hover:text-[#EAEAEF] transition-colors">
                Back to top
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
