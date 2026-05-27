'use client';

import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Calendar, Clock, TrendingUp, Zap } from 'lucide-react';
import { MOCK_DROPS } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { DifficultyRating } from '@/types';
import { cn } from '@/lib/utils';

const DIFFICULTY_CONFIG: Record<DifficultyRating, { label: string; color: string; bg: string }> = {
  easy: { label: 'EASY', color: '#00FF88', bg: 'rgba(0,255,136,0.1)' },
  medium: { label: 'MEDIUM', color: '#FFB800', bg: 'rgba(255,184,0,0.1)' },
  hard: { label: 'HARD', color: '#FF8C00', bg: 'rgba(255,140,0,0.1)' },
  near_impossible: { label: 'NEAR IMPOSSIBLE', color: '#FF3D57', bg: 'rgba(255,61,87,0.1)' },
};

export default function DropsPage() {
  const [reminded, setReminded] = useState<Set<string>>(new Set());

  const sortedDrops = [...MOCK_DROPS].sort((a, b) =>
    new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
  );

  function toggleReminder(id: string) {
    setReminded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-void">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-serif text-[28px] text-[#EAEAEF] mb-1">Drops Calendar</h1>
          <p className="font-mono text-[12px] text-ghost">{sortedDrops.length} upcoming drops • AI resale predictions</p>
        </div>

        {/* Calendar context strip */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-1">
          {sortedDrops.slice(0, 7).map(drop => {
            const date = new Date(drop.releaseDate);
            const isToday = new Date().toDateString() === date.toDateString();
            const diff = DIFFICULTY_CONFIG[drop.difficultyRating];
            return (
              <div
                key={drop.id}
                className={cn(
                  'flex-shrink-0 w-20 rounded-lg border p-2.5 text-center transition-colors',
                  isToday ? 'border-signal/40 bg-signal/5' : 'border-border-subtle bg-surface'
                )}
              >
                <p className="font-mono text-[10px] text-ghost">{format(date, 'MMM')}</p>
                <p className="font-mono text-[22px] font-bold text-[#EAEAEF] leading-none">{format(date, 'd')}</p>
                <div
                  className="mt-1.5 h-0.5 rounded-full mx-auto"
                  style={{ width: '60%', background: diff.color }}
                />
              </div>
            );
          })}
        </div>

        {/* Drop cards */}
        <div className="space-y-4">
          {sortedDrops.map(drop => {
            const diff = DIFFICULTY_CONFIG[drop.difficultyRating];
            const releaseDate = new Date(drop.releaseDate);
            const isReminded = reminded.has(drop.id);

            return (
              <div key={drop.id} className="rounded-lg border border-border-subtle bg-surface hover:border-border-hover transition-all group overflow-hidden">
                <div className="flex items-stretch">
                  {/* Gradient thumbnail */}
                  <div className={`w-24 flex-shrink-0 bg-gradient-to-br ${drop.imageGradient || 'from-gray-800 to-gray-950'} relative flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <span className="relative font-mono text-[9px] text-white/40 uppercase tracking-widest rotate-90 whitespace-nowrap">
                      {drop.category}
                    </span>
                  </div>

                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Metadata */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border tracking-wider"
                            style={{ color: diff.color, background: diff.bg, borderColor: diff.color + '40' }}
                          >
                            {diff.label}
                          </span>
                          <span className="font-mono text-[10px] text-ghost border border-border-subtle px-1.5 py-0.5 rounded">
                            {drop.releasePlatform}
                          </span>
                        </div>

                        <h3 className="font-semibold text-[17px] text-[#EAEAEF] mb-0.5 dense-text">{drop.itemName}</h3>
                        <p className="font-mono text-[12px] text-ghost mb-3">{drop.brand}</p>

                        {/* Price data */}
                        <div className="flex items-center gap-4 flex-wrap">
                          <div>
                            <p className="font-mono text-[10px] text-ghost uppercase tracking-wider mb-0.5">Retail</p>
                            <p className="font-mono text-[15px] font-semibold text-secondary">{formatCurrency(drop.retailPrice)}</p>
                          </div>
                          <div className="w-px h-8 bg-border-subtle" />
                          <div>
                            <p className="font-mono text-[10px] text-ghost uppercase tracking-wider mb-0.5">Predicted Resale</p>
                            <p className="font-mono text-[15px] font-semibold text-[#EAEAEF]">
                              {formatCurrency(drop.predictedResaleMin)} – {formatCurrency(drop.predictedResaleMax)}
                            </p>
                          </div>
                          <div className="w-px h-8 bg-border-subtle" />
                          <div>
                            <p className="font-mono text-[10px] text-ghost uppercase tracking-wider mb-0.5">Predicted Profit</p>
                            <p className="font-mono text-[18px] font-bold" style={{ color: '#00FF88' }}>
                              +{formatCurrency(drop.predictedProfit)}
                            </p>
                          </div>
                        </div>

                        {/* AI analysis */}
                        <p className="text-[12px] text-secondary leading-relaxed mt-3 line-clamp-2">{drop.aiAnalysis}</p>
                      </div>

                      {/* Right column — date + actions */}
                      <div className="flex flex-col items-end gap-3 flex-shrink-0 min-w-[120px]">
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 justify-end mb-1">
                            <Calendar size={11} className="text-ghost" />
                            <span className="font-mono text-[11px] text-[#EAEAEF]">
                              {format(releaseDate, 'MMM d, yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 justify-end">
                            <Clock size={11} className="text-ghost" />
                            <span className="font-mono text-[11px] text-secondary">
                              {formatDistanceToNow(releaseDate, { addSuffix: true })}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleReminder(drop.id)}
                          className={cn(
                            'h-8 px-3 rounded border font-mono text-[11px] flex items-center gap-1.5 transition-all',
                            isReminded
                              ? 'border-signal/30 bg-signal/10 text-signal'
                              : 'border-border-subtle bg-elevated text-ghost hover:text-[#EAEAEF]'
                          )}
                        >
                          {isReminded ? (
                            <><Zap size={10} fill="currentColor" /> Reminded</>
                          ) : (
                            <>Set Reminder</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
