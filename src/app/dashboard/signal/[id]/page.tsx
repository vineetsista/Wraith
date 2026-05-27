'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, Check, Share2, TrendingUp, TrendingDown, ExternalLink, Sparkles, Send } from 'lucide-react';
import { MOCK_SIGNALS, MOCK_PRICE_HISTORIES } from '@/lib/mock-data';
import { formatCurrency, formatPercent, getPlatformLabel, timeAgo } from '@/lib/utils';
import ConfidenceGauge from '@/components/signals/ConfidenceGauge';
import PlatformBadge from '@/components/signals/PlatformBadge';
import UrgencyBadge from '@/components/signals/UrgencyBadge';
import PriceHistoryChart from '@/components/charts/PriceHistoryChart';
import SignalCard from '@/components/signals/SignalCard';
import ProfitCalculator from '@/components/signals/ProfitCalculator';
import ConfidenceBreakdown from '@/components/signals/ConfidenceBreakdown';
import SignalDetailActions from '@/components/signals/SignalDetailActions';
import { Platform } from '@/types';

interface Props {
  params: { id: string };
}

export default function SignalDetailPage({ params }: Props) {
  const signal = MOCK_SIGNALS.find(s => s.id === params.id);
  if (!signal) notFound();

  const priceHistory = MOCK_PRICE_HISTORIES[signal.itemName] ||
    Object.values(MOCK_PRICE_HISTORIES)[0];

  const related = MOCK_SIGNALS
    .filter(s => s.id !== signal.id && (s.category === signal.category || s.brand === signal.brand))
    .slice(0, 3);

  const PLATFORM_TABLE: { platform: Platform; ask: number; bid: number; lastSale: number; fees: number; netProfit: number }[] = [
    { platform: 'stockx', ask: signal.sellPrice, bid: signal.sellPrice - 15, lastSale: signal.sellPrice - 5, fees: Math.round(signal.sellPrice * 0.095), netProfit: Math.round(signal.sellPrice * 0.905 - signal.buyPrice) },
    { platform: 'goat', ask: signal.sellPrice + 8, bid: signal.sellPrice - 12, lastSale: signal.sellPrice + 3, fees: Math.round((signal.sellPrice + 8) * 0.095), netProfit: Math.round((signal.sellPrice + 8) * 0.905 - signal.buyPrice) },
    { platform: 'ebay', ask: signal.sellPrice - 20, bid: signal.sellPrice - 35, lastSale: signal.sellPrice - 18, fees: Math.round((signal.sellPrice - 20) * 0.129), netProfit: Math.round((signal.sellPrice - 20) * 0.871 - signal.buyPrice) },
    { platform: 'mercari', ask: signal.buyPrice, bid: signal.buyPrice - 15, lastSale: signal.buyPrice + 5, fees: Math.round(signal.buyPrice * 0.1), netProfit: Math.round(signal.buyPrice * 0.9 - signal.buyPrice) },
    { platform: 'grailed', ask: signal.sellPrice - 10, bid: signal.sellPrice - 25, lastSale: signal.sellPrice - 8, fees: Math.round((signal.sellPrice - 10) * 0.09), netProfit: Math.round((signal.sellPrice - 10) * 0.91 - signal.buyPrice) },
  ];

  return (
    <div className="min-h-screen bg-void">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Back nav */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 font-mono text-[12px] text-secondary hover:text-[#EAEAEF] mb-6 transition-colors"
        >
          <ArrowLeft size={12} /> Back to signals
        </Link>

        {/* Hero section */}
        <div className="grid lg:grid-cols-[1fr,auto] gap-6 mb-8">
          <div className="rounded-lg border border-border-subtle bg-surface overflow-hidden">
            <div className={`h-48 bg-gradient-to-br ${signal.imageGradient || 'from-gray-800 to-gray-950'} relative`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-4">
                <UrgencyBadge urgency={signal.urgency} />
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-semibold text-[24px] text-[#EAEAEF] leading-tight mb-1 dense-text">
                    {signal.itemName}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[13px] text-secondary">{signal.brand}</span>
                    {signal.size && (
                      <span className="font-mono text-[11px] text-ghost border border-border-subtle px-1.5 rounded">SZ {signal.size}</span>
                    )}
                    <span className="font-mono text-[11px] text-ghost">{timeAgo(signal.createdAt)}</span>
                  </div>
                </div>
                <ConfidenceGauge value={signal.confidence} size="lg" />
              </div>

              {/* Spread visualization */}
              <div className="flex items-center gap-3 mb-4 p-4 bg-elevated rounded-lg border border-border-subtle">
                <div className="flex-1 text-center">
                  <p className="font-mono text-[10px] text-ghost uppercase tracking-wider mb-1">BUY</p>
                  <PlatformBadge platform={signal.buyPlatform} size="md" />
                  <p className="font-mono text-[24px] font-bold text-[#EAEAEF] mt-2">{formatCurrency(signal.buyPrice)}</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <TrendingUp size={20} className="text-signal" />
                  <div className="h-px w-12 bg-signal/30" />
                </div>
                <div className="flex-1 text-center">
                  <p className="font-mono text-[10px] text-ghost uppercase tracking-wider mb-1">SELL</p>
                  <PlatformBadge platform={signal.sellPlatform} size="md" />
                  <p className="font-mono text-[24px] font-bold text-[#EAEAEF] mt-2">{formatCurrency(signal.sellPrice)}</p>
                </div>
                <div className="flex-1 text-center border-l border-border-subtle ml-3 pl-3">
                  <p className="font-mono text-[10px] text-ghost uppercase tracking-wider mb-1">NET PROFIT</p>
                  <p className="font-mono text-[28px] font-bold leading-none" style={{ color: '#00FF88', textShadow: '0 0 16px rgba(0,255,136,0.4)' }}>
                    {formatCurrency(signal.profit)}
                  </p>
                  <p className="font-mono text-[11px] text-ghost mt-1">{formatPercent(signal.roi)} ROI</p>
                </div>
              </div>

              {/* Action bar */}
              <SignalDetailActions signal={signal} />
            </div>
          </div>

          {/* AI Analysis */}
          <div className="lg:w-72 rounded-lg border border-border-subtle bg-surface p-5 flex flex-col gap-5 h-fit">
            <div>
              <p className="font-mono text-[10px] text-ghost uppercase tracking-wider mb-3">AI ANALYSIS</p>
              <p className="text-[13px] text-secondary leading-relaxed">{signal.aiNarrative}</p>
            </div>

            <div className="border-t border-border-subtle pt-4">
              <p className="font-mono text-[10px] text-ghost uppercase tracking-wider mb-3">SIGNAL DATA</p>
              <div className="space-y-2.5">
                {[
                  { label: 'Signal Type', value: signal.signalType.replace(/_/g, ' ').toUpperCase() },
                  { label: 'Category', value: signal.category },
                  { label: 'Confidence', value: `${signal.confidence}%` },
                  { label: 'Platform Fees', value: formatCurrency(signal.fees) },
                  ...(signal.tiktokMentions ? [{ label: 'TikTok Mentions', value: signal.tiktokMentions.toLocaleString() }] : []),
                  ...(signal.socialScore ? [{ label: 'Social Score', value: `${signal.socialScore}/100` }] : []),
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-ghost">{row.label}</span>
                    <span className="font-mono text-[11px] text-[#EAEAEF] capitalize">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Confidence breakdown + Profit calculator */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <ConfidenceBreakdown signal={signal} />
          <ProfitCalculator signal={signal} />
        </div>

        {/* Price history chart */}
        {priceHistory && (
          <div className="rounded-lg border border-border-subtle bg-surface p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-[16px] text-[#EAEAEF]">Price History</h2>
                <p className="font-mono text-[11px] text-ghost">90-day price across all platforms</p>
              </div>
              <div className="flex items-center gap-1 font-mono text-[11px] text-ghost border border-border-subtle rounded px-2 py-1">
                90 days
              </div>
            </div>
            <PriceHistoryChart history={priceHistory} height={260} />
          </div>
        )}

        {/* Platform comparison table */}
        <div className="rounded-lg border border-border-subtle bg-surface overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-border-subtle">
            <h2 className="font-semibold text-[16px] text-[#EAEAEF]">Platform Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  {['Platform', 'Ask', 'Bid', 'Last Sale', 'Fees', 'Net Profit'].map(col => (
                    <th key={col} className="px-4 py-3 text-left font-mono text-[10px] text-ghost uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLATFORM_TABLE.map((row, i) => (
                  <tr key={row.platform} className={`border-b border-border-subtle hover:bg-elevated transition-colors ${i === 0 || i === 3 ? '' : ''}`}>
                    <td className="px-4 py-3">
                      <PlatformBadge platform={row.platform} size="sm" />
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-[#EAEAEF]">{formatCurrency(row.ask)}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-secondary">{formatCurrency(row.bid)}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-secondary">{formatCurrency(row.lastSale)}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-ghost">{formatCurrency(row.fees)}</td>
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-[13px] font-semibold"
                        style={{ color: row.netProfit > 0 ? '#00FF88' : '#FF3D57' }}
                      >
                        {row.netProfit > 0 ? '+' : ''}{formatCurrency(row.netProfit)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Related signals */}
        {related.length > 0 && (
          <div>
            <h2 className="font-semibold text-[16px] text-[#EAEAEF] mb-4">Similar Signals</h2>
            <div className="space-y-2">
              {related.map(s => (
                <Link key={s.id} href={`/dashboard/signal/${s.id}`}>
                  <SignalCard signal={s} compact />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
