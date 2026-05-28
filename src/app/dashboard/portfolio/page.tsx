'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Cell, PieChart, Pie,
} from 'recharts';
import {
  Briefcase, TrendingUp, Wallet, Trophy, Calendar, Activity, ArrowRight, Eye, Plus,
} from 'lucide-react';
import {
  getPortfolioFlips, getPortfolioStats, getMonthlyPerformance, getCategoryPerformance, PortfolioFlip,
} from '@/lib/portfolio-data';
import { formatCurrency, formatPercent, timeAgo, getCategoryLabel, getPlatformLabel, cn } from '@/lib/utils';
import { useAnimateNumber } from '@/hooks/useAnimateNumber';
import { useWraith } from '@/lib/wraith-context';

const STATUS_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  sold: { color: '#00FF88', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.3)' },
  open: { color: '#4D7CFF', bg: 'rgba(77,124,255,0.08)', border: 'rgba(77,124,255,0.3)' },
  monitoring: { color: '#FFB800', bg: 'rgba(255,184,0,0.08)', border: 'rgba(255,184,0,0.3)' },
  cancelled: { color: '#FF3D57', bg: 'rgba(255,61,87,0.08)', border: 'rgba(255,61,87,0.3)' },
};

const PIE_COLORS = ['#00FF88', '#4D7CFF', '#FFB800', '#FF3D57', '#9F7AEA'];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-elevated border border-border-hover rounded-lg p-2.5 shadow-card">
      <p className="font-mono text-[10px] text-ghost mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="font-mono text-[11px]" style={{ color: p.color || p.fill }}>
          {p.dataKey === 'profit' ? formatCurrency(p.value) : p.value} {p.name}
        </p>
      ))}
    </div>
  );
}

export default function PortfolioPage() {
  const { hydrated, demoMode } = useWraith();
  // Until hydration completes, assume demo mode so the page renders fully (avoids empty-state flash).
  const effectiveDemoMode = hydrated ? demoMode : true;
  const flips = useMemo(() => (effectiveDemoMode ? getPortfolioFlips() : []), [effectiveDemoMode]);
  const stats = useMemo(() => getPortfolioStats(flips), [flips]);
  const monthly = useMemo(() => (effectiveDemoMode ? getMonthlyPerformance(flips) : []), [effectiveDemoMode, flips]);
  const categories = useMemo(() => getCategoryPerformance(flips), [flips]);
  const [filter, setFilter] = useState<'all' | 'open' | 'sold' | 'monitoring'>('all');

  const filteredFlips = flips.filter(f => filter === 'all' || f.status === filter);

  const animatedProfit = useAnimateNumber(stats.realizedProfit, 1200, 100);
  const animatedDeployed = useAnimateNumber(stats.capitalDeployed, 900, 200);
  const animatedRevenue = useAnimateNumber(stats.totalRevenue, 1000, 300);
  const animatedWin = useAnimateNumber(Math.round(stats.winRate), 800, 400);

  return (
    <div className="min-h-screen bg-void">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase size={16} className="text-signal" />
              <h1 className="font-serif text-[28px] text-[#EAEAEF] leading-none">Portfolio</h1>
            </div>
            <p className="font-mono text-[12px] text-ghost">Your live capital deployment & realized P&L</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded border border-border-subtle bg-elevated">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse-fast" />
              <span className="font-mono text-[11px] text-ghost">Auto-sync: <span className="text-signal">live</span></span>
            </div>
            <button className="h-9 px-4 rounded border border-signal/30 bg-signal/5 text-signal font-mono text-[12px] flex items-center gap-1.5 hover:bg-signal/10 transition-all">
              <Plus size={12} /> Log Flip
            </button>
          </div>
        </div>

        {!effectiveDemoMode ? (
          <div className="rounded-lg border border-border-subtle bg-surface p-12 text-center">
            <Briefcase size={28} className="text-ghost mx-auto mb-3" />
            <p className="font-serif text-[20px] text-[#EAEAEF] mb-2">No flips logged yet</p>
            <p className="font-mono text-[12px] text-ghost mb-6 max-w-md mx-auto">Mark signals as flipped from the dashboard, or import your sale history from StockX/GOAT to start tracking realized P&amp;L.</p>
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 h-9 px-4 rounded border border-signal/30 bg-signal/5 text-signal font-mono text-[12px] hover:bg-signal/10 transition-colors">
              Browse signals <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <>
            {/* Hero metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <MetricBlock
                icon={Wallet}
                label="Realized profit (90d)"
                value={formatCurrency(animatedProfit)}
                sub={`${stats.soldCount} flips closed`}
                color="#00FF88"
                accent
              />
              <MetricBlock
                icon={Briefcase}
                label="Capital deployed"
                value={formatCurrency(animatedDeployed)}
                sub={`${stats.openCount} positions open`}
                color="#4D7CFF"
              />
              <MetricBlock
                icon={TrendingUp}
                label="Total revenue"
                value={formatCurrency(animatedRevenue)}
                sub={`avg ${formatCurrency(Math.round(stats.avgProfit))}/flip`}
                color="#EAEAEF"
              />
              <MetricBlock
                icon={Trophy}
                label="Win rate"
                value={`${animatedWin}%`}
                sub={`${Math.round(stats.avgDaysHeld)}d avg hold`}
                color="#FFB800"
              />
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-3 gap-4 mb-6">
              <div className="lg:col-span-2 rounded-lg border border-border-subtle bg-surface p-5">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-semibold text-[15px] text-[#EAEAEF]">Monthly P&amp;L</h2>
                  <span className="font-mono text-[10px] text-ghost">last 6 months</span>
                </div>
                <p className="font-mono text-[11px] text-ghost mb-4">Realized profit per closed month</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={monthly} margin={{ top: 8, right: 4, bottom: 0, left: -10 }}>
                    <defs>
                      <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00FF88" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#00FF88" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#3A3A48', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#3A3A48', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `$${v}`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="profit" stroke="#00FF88" strokeWidth={2} fill="url(#portfolioFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg border border-border-subtle bg-surface p-5">
                <h2 className="font-semibold text-[15px] text-[#EAEAEF] mb-1">Category mix</h2>
                <p className="font-mono text-[11px] text-ghost mb-4">By realized profit</p>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey="profit"
                      nameKey="category"
                      innerRadius={42}
                      outerRadius={68}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {categories.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1">
                  {categories.map((c, i) => (
                    <div key={c.category} className="flex items-center justify-between text-[11px] font-mono">
                      <span className="flex items-center gap-1.5 text-secondary">
                        <span className="w-2 h-2 rounded-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        {getCategoryLabel(c.category as any)}
                      </span>
                      <span className="text-ghost">{formatCurrency(c.profit)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Best flip + active positions header */}
            <div className="grid lg:grid-cols-3 gap-4 mb-4">
              {stats.bestFlip && (
                <div className="lg:col-span-1 rounded-lg border border-gold/30 bg-gold/5 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy size={13} className="text-gold" />
                    <p className="font-mono text-[10px] uppercase tracking-wider text-gold">Best flip ever</p>
                  </div>
                  <p className="font-serif text-[18px] text-[#EAEAEF] leading-tight mb-1">{stats.bestFlip.itemName}</p>
                  <p className="font-mono text-[11px] text-secondary mb-3">
                    {getPlatformLabel(stats.bestFlip.buyPlatform)} → {getPlatformLabel(stats.bestFlip.sellPlatform)} · {stats.bestFlip.daysHeld}d hold
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[28px] font-bold text-gold leading-none">{formatCurrency(stats.bestFlip.profit)}</span>
                    <span className="font-mono text-[11px] text-secondary">
                      {Math.round((stats.bestFlip.profit / stats.bestFlip.buyPrice) * 100)}% ROI
                    </span>
                  </div>
                </div>
              )}

              <div className="lg:col-span-2 rounded-lg border border-signal/20 bg-signal/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={13} className="text-signal" />
                  <p className="font-mono text-[10px] uppercase tracking-wider text-signal">Projected upside · open positions</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="font-mono text-[28px] font-bold text-signal leading-none mb-1">{formatCurrency(stats.projectedProfit)}</p>
                    <p className="font-mono text-[10px] text-secondary">net of fees</p>
                  </div>
                  <div>
                    <p className="font-mono text-[20px] font-bold text-[#EAEAEF] leading-none mb-1">{stats.openCount}</p>
                    <p className="font-mono text-[10px] text-secondary">positions</p>
                  </div>
                  <div>
                    <p className="font-mono text-[20px] font-bold text-[#EAEAEF] leading-none mb-1">{formatCurrency(stats.capitalDeployed)}</p>
                    <p className="font-mono text-[10px] text-secondary">at risk</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1.5 mb-2">
              {(['all', 'open', 'monitoring', 'sold'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'h-7 px-3 rounded border font-mono text-[11px] capitalize transition-colors',
                    filter === f
                      ? 'border-signal/40 bg-signal/10 text-signal'
                      : 'border-border-subtle bg-surface text-ghost hover:text-secondary',
                  )}
                >
                  {f === 'all' ? `All (${flips.length})` : `${f} (${flips.filter(x => x.status === f).length})`}
                </button>
              ))}
            </div>

            {/* Flip table */}
            <div className="rounded-lg border border-border-subtle bg-surface overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      {['Item', 'Status', 'Route', 'Buy', 'Sell / List', 'Profit', 'Held', 'Conf'].map(col => (
                        <th key={col} className="px-4 py-2.5 text-left font-mono text-[9px] text-ghost uppercase tracking-wider whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFlips.map(f => (
                      <FlipRow key={f.id} flip={f} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MetricBlock({ icon: Icon, label, value, sub, color, accent }: {
  icon: any; label: string; value: string; sub: string; color: string; accent?: boolean;
}) {
  return (
    <div className={cn('rounded-lg border bg-surface p-4', accent ? 'border-signal/25' : 'border-border-subtle')} style={accent ? { boxShadow: '0 0 24px rgba(0,255,136,0.04)' } : undefined}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={12} style={{ color }} />
        <span className="font-mono text-[9px] text-ghost uppercase tracking-wider">{label}</span>
      </div>
      <p className={cn('font-mono text-[24px] font-bold leading-none mb-1', accent ? 'text-signal' : 'text-[#EAEAEF]')}>{value}</p>
      <p className="font-mono text-[10px] text-secondary">{sub}</p>
    </div>
  );
}

function FlipRow({ flip }: { flip: PortfolioFlip }) {
  const c = STATUS_COLORS[flip.status];
  const isOpen = flip.status === 'open' || flip.status === 'monitoring';
  const projected = isOpen && flip.listPrice ? flip.listPrice - flip.buyPrice - Math.round(flip.listPrice * 0.09) : 0;

  return (
    <tr className="border-b border-border-subtle last:border-0 hover:bg-elevated transition-colors">
      <td className="px-4 py-2.5">
        {flip.signalId ? (
          <Link href={`/dashboard/signal/${flip.signalId}`} className="block group">
            <p className="font-mono text-[12px] text-[#EAEAEF] truncate group-hover:text-signal transition-colors">{flip.itemName}</p>
            <p className="font-mono text-[10px] text-ghost">{flip.brand} · {getCategoryLabel(flip.category as any)}</p>
          </Link>
        ) : (
          <>
            <p className="font-mono text-[12px] text-[#EAEAEF] truncate">{flip.itemName}</p>
            <p className="font-mono text-[10px] text-ghost">{flip.brand} · {getCategoryLabel(flip.category as any)}</p>
          </>
        )}
      </td>
      <td className="px-4 py-2.5">
        <span
          className="font-mono text-[9px] px-1.5 py-0.5 rounded border uppercase"
          style={{ color: c.color, background: c.bg, borderColor: c.border }}
        >
          {flip.status}
        </span>
      </td>
      <td className="px-4 py-2.5 font-mono text-[11px] text-secondary whitespace-nowrap">
        {getPlatformLabel(flip.buyPlatform)} <span className="text-ghost">→</span> {getPlatformLabel(flip.sellPlatform)}
      </td>
      <td className="px-4 py-2.5 font-mono text-[12px] text-[#EAEAEF] whitespace-nowrap">{formatCurrency(flip.buyPrice)}</td>
      <td className="px-4 py-2.5 font-mono text-[12px] text-[#EAEAEF] whitespace-nowrap">
        {flip.soldPrice != null ? formatCurrency(flip.soldPrice) : flip.listPrice != null ? <><span className="text-ghost text-[10px]">listed </span>{formatCurrency(flip.listPrice)}</> : '—'}
      </td>
      <td className="px-4 py-2.5 font-mono text-[12px] font-semibold whitespace-nowrap" style={{ color: isOpen ? '#FFB800' : (flip.profit >= 0 ? '#00FF88' : '#FF3D57') }}>
        {isOpen ? `${formatCurrency(projected)} proj` : formatCurrency(flip.profit)}
      </td>
      <td className="px-4 py-2.5 font-mono text-[11px] text-secondary whitespace-nowrap">
        {flip.daysHeld != null ? `${flip.daysHeld}d` : `${Math.max(1, Math.floor((Date.now() - flip.boughtAt.getTime()) / 86400000))}d`}
      </td>
      <td className="px-4 py-2.5 font-mono text-[11px] text-secondary">{flip.confidence ?? '—'}{flip.confidence ? '%' : ''}</td>
    </tr>
  );
}
