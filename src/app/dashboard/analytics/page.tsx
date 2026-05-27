'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { MOCK_ANALYTICS } from '@/lib/mock-data';
import { useAnimateNumber } from '@/hooks/useAnimateNumber';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import MarketHeatmap from '@/components/analytics/MarketHeatmap';

function StatCard({ label, value, sub, accent, delay = 0 }: {
  label: string; value: string; sub?: string; accent?: boolean; delay?: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), delay); return () => clearTimeout(t); }, [delay]);

  return (
    <div
      className="rounded-lg border border-border-subtle bg-surface p-5"
      style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}
    >
      <p className="font-mono text-[10px] text-ghost uppercase tracking-wider mb-3">{label}</p>
      <p className={`font-mono text-[28px] font-bold leading-none mb-1 ${accent ? 'text-signal' : 'text-[#EAEAEF]'}`}>{value}</p>
      {sub && <p className="font-mono text-[11px] text-secondary">{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-elevated border border-border-hover rounded-lg p-3 shadow-card">
      <p className="font-mono text-[10px] text-ghost mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="font-mono text-[11px]" style={{ color: p.color }}>
          {p.name}: {p.dataKey === 'profit' ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const data = MOCK_ANALYTICS;
  const profit = useAnimateNumber(data.estimatedProfit, 1000, 200);
  const signals = useAnimateNumber(data.totalSignalsViewed, 800, 100);
  const winRate = useAnimateNumber(Math.round(data.winRate), 700, 300);

  return (
    <div className="min-h-screen bg-void">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-serif text-[28px] text-[#EAEAEF] mb-1">Analytics</h1>
          <p className="font-mono text-[12px] text-ghost">Personal performance & market intelligence</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
          <StatCard label="Total Profit" value={formatCurrency(profit)} sub="estimated from signals" accent delay={0} />
          <StatCard label="Signals Viewed" value={signals.toLocaleString()} sub="all-time" delay={60} />
          <StatCard label="Flips Tracked" value={data.signalsFlipped.toString()} sub="marked complete" delay={120} />
          <StatCard label="Avg Profit/Flip" value={formatCurrency(data.avgProfitPerFlip)} sub="per transaction" delay={180} />
          <StatCard label="Best Flip" value={formatCurrency(data.bestFlipProfit)} sub="single trade" accent delay={240} />
          <StatCard label="Win Rate" value={`${winRate}%`} sub="profitable signals" delay={300} />
        </div>

        {/* Charts grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly trends */}
          <div className="rounded-lg border border-border-subtle bg-surface p-5">
            <h2 className="font-semibold text-[15px] text-[#EAEAEF] mb-1">Signal Volume (28 days)</h2>
            <p className="font-mono text-[11px] text-ghost mb-5">Daily signals detected</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.weeklyTrends} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#3A3A48', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} interval={6} />
                <YAxis tick={{ fontSize: 10, fill: '#3A3A48', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="signals" name="Signals" stroke="#00FF88" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category breakdown */}
          <div className="rounded-lg border border-border-subtle bg-surface p-5">
            <h2 className="font-semibold text-[15px] text-[#EAEAEF] mb-1">Category Breakdown</h2>
            <p className="font-mono text-[11px] text-ghost mb-5">Signals by category</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.categoryBreakdown} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#3A3A48', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#3A3A48', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Signals" radius={[2, 2, 0, 0]}>
                  {data.categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#00FF88' : `rgba(0,255,136,${0.7 - i * 0.12})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Heatmap */}
        <div className="mb-6">
          <MarketHeatmap />
        </div>

        {/* Platform comparison + Hot items */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Platform comparison */}
          <div className="rounded-lg border border-border-subtle bg-surface p-5">
            <h2 className="font-semibold text-[15px] text-[#EAEAEF] mb-4">Platform Underpricing</h2>
            <div className="space-y-3">
              {data.platformComparison.map((p, i) => (
                <div key={p.platform}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[12px] text-[#EAEAEF]">{p.platform}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-ghost">{p.underpriced.toLocaleString()} listings</span>
                      <span className="font-mono text-[11px] text-signal">-{p.avgDiscount.toFixed(1)}% avg</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(p.underpriced / data.platformComparison[0].underpriced) * 100}%`,
                        background: `rgba(0,255,136,${0.9 - i * 0.15})`,
                        transitionDelay: `${i * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hot items */}
          <div className="rounded-lg border border-border-subtle bg-surface p-5">
            <h2 className="font-semibold text-[15px] text-[#EAEAEF] mb-4">Hottest Items This Week</h2>
            <div className="space-y-2.5">
              {data.hotItems.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-[10px] text-ghost w-4 flex-shrink-0">{(i + 1).toString().padStart(2, '0')}</span>
                    <span className="font-mono text-[12px] text-[#EAEAEF] truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-mono text-[10px] text-ghost">{item.signalCount} signals</span>
                    <span className="font-mono text-[12px] font-semibold text-signal">{formatCurrency(item.avgProfit)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social momentum */}
        <div className="rounded-lg border border-border-subtle bg-surface overflow-hidden">
          <div className="px-5 py-4 border-b border-border-subtle">
            <h2 className="font-semibold text-[15px] text-[#EAEAEF]">Social Momentum</h2>
            <p className="font-mono text-[11px] text-ghost">Items with rising social attention before price movement</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  {['Item', 'TikTok', 'Instagram', 'Price Impact', 'Trend', 'Current Price'].map(col => (
                    <th key={col} className="px-4 py-3 text-left font-mono text-[10px] text-ghost uppercase tracking-wider whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.socialMomentum.map(item => (
                  <tr key={item.itemName} className="border-b border-border-subtle last:border-0 hover:bg-elevated transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-mono text-[12px] text-[#EAEAEF]">{item.itemName}</p>
                      <p className="font-mono text-[10px] text-ghost">{item.brand}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-secondary">{formatNumber(item.tiktokMentions)}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-secondary">{formatNumber(item.instagramEngagement)}</td>
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-[12px] font-semibold"
                        style={{ color: item.priceImpact > 0 ? '#00FF88' : '#FF3D57' }}
                      >
                        {item.priceImpact > 0 ? '+' : ''}{item.priceImpact.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.trend === 'rising' && <TrendingUp size={13} className="text-signal" />}
                      {item.trend === 'falling' && <TrendingDown size={13} className="text-warning" />}
                      {item.trend === 'stable' && <span className="font-mono text-[10px] text-ghost">FLAT</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-[#EAEAEF]">{formatCurrency(item.currentPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
