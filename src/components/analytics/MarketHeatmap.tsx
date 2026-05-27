'use client';

import { useMemo, useState } from 'react';
import { Flame, ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { MOCK_SIGNALS } from '@/lib/mock-data';
import { Platform, Category, CATEGORIES, PLATFORMS } from '@/types';
import { cn, formatCurrency, getCategoryLabel, getPlatformLabel } from '@/lib/utils';

const CATS: Category[] = ['sneakers', 'streetwear', 'trading_cards', 'vintage', 'electronics', 'collectibles'];
const PLATS: Platform[] = ['stockx', 'goat', 'ebay', 'mercari', 'grailed'];

interface Cell {
  category: Category;
  platform: Platform;
  count: number;
  totalProfit: number;
  avgConfidence: number;
  bestProfit: number;
  hottest?: string;
}

function buildHeatmap(): Cell[] {
  const cells: Cell[] = [];
  for (const cat of CATS) {
    for (const plat of PLATS) {
      const matches = MOCK_SIGNALS.filter(s => s.category === cat && (s.buyPlatform === plat || s.sellPlatform === plat));
      const count = matches.length;
      const totalProfit = matches.reduce((sum, s) => sum + s.profit, 0);
      const bestProfit = matches.reduce((max, s) => Math.max(max, s.profit), 0);
      const avgConfidence = count ? matches.reduce((sum, s) => sum + s.confidence, 0) / count : 0;
      const hottest = matches.sort((a, b) => b.confidence - a.confidence)[0]?.itemName;
      cells.push({ category: cat, platform: plat, count, totalProfit, avgConfidence, bestProfit, hottest });
    }
  }
  return cells;
}

function intensity(value: number, max: number) {
  if (max === 0) return 0;
  return Math.min(1, value / max);
}

export default function MarketHeatmap() {
  const cells = useMemo(buildHeatmap, []);
  const [metric, setMetric] = useState<'profit' | 'count' | 'confidence'>('profit');
  const [hover, setHover] = useState<Cell | null>(null);

  const maxByMetric = useMemo(() => ({
    profit: Math.max(...cells.map(c => c.totalProfit)),
    count: Math.max(...cells.map(c => c.count)),
    confidence: 100,
  }), [cells]);

  return (
    <div className="rounded-lg border border-border-subtle bg-surface p-5">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Flame size={13} className="text-warning" />
          <h2 className="font-semibold text-[15px] text-[#EAEAEF]">Market Heatmap</h2>
        </div>
        <div className="flex items-center gap-1.5">
          {(['profit', 'count', 'confidence'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={cn(
                'h-7 px-2.5 rounded border font-mono text-[10px] capitalize transition-colors',
                metric === m
                  ? 'border-signal/40 bg-signal/10 text-signal'
                  : 'border-border-subtle bg-elevated text-ghost hover:text-secondary',
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <p className="font-mono text-[11px] text-ghost mb-4">Category × platform · darker = more {metric}</p>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header row */}
          <div className="grid" style={{ gridTemplateColumns: `120px repeat(${PLATS.length}, minmax(80px, 1fr))` }}>
            <div />
            {PLATS.map(p => (
              <div key={p} className="px-2 pb-2 text-center">
                <p className="font-mono text-[10px] text-secondary">{getPlatformLabel(p)}</p>
              </div>
            ))}
          </div>
          {/* Data rows */}
          {CATS.map(cat => (
            <div key={cat} className="grid items-stretch" style={{ gridTemplateColumns: `120px repeat(${PLATS.length}, minmax(80px, 1fr))` }}>
              <div className="px-2 py-3 flex items-center gap-1.5">
                <span className="text-[14px]">{CATEGORIES[cat].icon}</span>
                <span className="font-mono text-[11px] text-[#EAEAEF]">{getCategoryLabel(cat)}</span>
              </div>
              {PLATS.map(plat => {
                const cell = cells.find(c => c.category === cat && c.platform === plat)!;
                const value =
                  metric === 'profit' ? cell.totalProfit :
                  metric === 'count' ? cell.count :
                  cell.avgConfidence;
                const i = intensity(value, maxByMetric[metric]);
                const isHover = hover === cell;
                return (
                  <div
                    key={plat}
                    onMouseEnter={() => setHover(cell)}
                    onMouseLeave={() => setHover(null)}
                    className="m-0.5 rounded relative cursor-pointer transition-all flex flex-col items-center justify-center min-h-[58px]"
                    style={{
                      background: i === 0 ? 'rgba(255,255,255,0.02)' : `rgba(0, 255, 136, ${0.08 + i * 0.4})`,
                      border: isHover ? '1px solid rgba(0,255,136,0.5)' : '1px solid rgba(255,255,255,0.04)',
                      boxShadow: i > 0.7 ? `0 0 12px rgba(0,255,136,${i * 0.25})` : undefined,
                    }}
                  >
                    {cell.count > 0 ? (
                      <>
                        <p className="font-mono text-[13px] font-bold text-[#EAEAEF] leading-none">
                          {metric === 'profit' ? formatCurrency(cell.totalProfit) : metric === 'count' ? cell.count : `${Math.round(cell.avgConfidence)}%`}
                        </p>
                        <p className="font-mono text-[9px] text-ghost mt-0.5">{cell.count} signal{cell.count > 1 ? 's' : ''}</p>
                      </>
                    ) : (
                      <span className="font-mono text-[10px] text-ghost">—</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {hover && hover.count > 0 && (
        <div className="mt-4 p-3 rounded border border-signal/20 bg-signal/5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="font-mono text-[12px] text-[#EAEAEF]">
                {CATEGORIES[hover.category].icon} <span className="text-secondary">{getCategoryLabel(hover.category)}</span> on <span className="text-signal">{getPlatformLabel(hover.platform)}</span>
              </p>
              {hover.hottest && <p className="font-mono text-[10px] text-ghost mt-0.5">Hottest: {hover.hottest}</p>}
            </div>
            <div className="flex items-center gap-4 font-mono text-[10px]">
              <span><span className="text-ghost">total: </span><span className="text-signal">{formatCurrency(hover.totalProfit)}</span></span>
              <span><span className="text-ghost">best: </span><span className="text-[#EAEAEF]">{formatCurrency(hover.bestProfit)}</span></span>
              <span><span className="text-ghost">conf: </span><span className="text-[#EAEAEF]">{Math.round(hover.avgConfidence)}%</span></span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border-subtle flex-wrap">
        <div className="flex items-center gap-2 font-mono text-[10px] text-ghost">
          <span>Low</span>
          <div className="flex items-center gap-0.5">
            {[0.05, 0.15, 0.3, 0.45, 0.6, 0.8].map(i => (
              <span key={i} className="w-5 h-3 rounded-sm" style={{ background: `rgba(0,255,136,${i})` }} />
            ))}
          </div>
          <span>High</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-ghost">
          <span className="flex items-center gap-1"><ArrowUpRight size={9} className="text-signal" /> rising</span>
          <span className="flex items-center gap-1"><Minus size={9} /> flat</span>
          <span className="flex items-center gap-1"><ArrowDownRight size={9} className="text-warning" /> cooling</span>
        </div>
      </div>
    </div>
  );
}
