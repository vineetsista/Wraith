'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Bell, BellOff, StickyNote, TrendingUp, TrendingDown, Minus, Trash2 } from 'lucide-react';
import { MOCK_SIGNALS } from '@/lib/mock-data';
import { useWraith } from '@/lib/wraith-context';
import { formatCurrency, formatPercent, timeAgo } from '@/lib/utils';
import ConfidenceGauge from '@/components/signals/ConfidenceGauge';
import PlatformBadge from '@/components/signals/PlatformBadge';
import UrgencyBadge from '@/components/signals/UrgencyBadge';

const DEMO_WATCHLIST = MOCK_SIGNALS.filter(s => s.confidence >= 80).slice(0, 6).map(s => ({
  ...s,
  alertEnabled: Math.random() > 0.4,
  alertThresholdProfit: 50,
  alertThresholdConfidence: 80,
  notes: Math.random() > 0.6 ? 'Checking seller reputation' : undefined,
  trend: ['up', 'down', 'flat'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'flat',
  trendPct: (Math.random() * 15 + 1).toFixed(1),
}));

export default function WatchlistPage() {
  const { demoMode } = useWraith();
  const [items, setItems] = useState(demoMode ? DEMO_WATCHLIST : []);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function toggleAlert(id: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, alertEnabled: !i.alertEnabled } : i));
  }

  return (
    <div className="min-h-screen bg-void">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-[28px] text-[#EAEAEF] mb-1">Watchlist</h1>
            <p className="font-mono text-[12px] text-ghost">{items.length} items tracked • Alerts active for {items.filter(i => i.alertEnabled).length}</p>
          </div>
          <Link
            href="/dashboard"
            className="h-8 px-4 rounded border border-border-subtle bg-surface font-mono text-[12px] text-secondary hover:text-[#EAEAEF] hover:border-border-hover transition-colors"
          >
            + Add Signal
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full border border-border-subtle bg-surface flex items-center justify-center mx-auto mb-4">
              <Star size={24} className="text-ghost" />
            </div>
            <p className="text-secondary text-[15px] mb-2">Your watchlist is empty</p>
            <p className="font-mono text-[12px] text-ghost mb-6">Add signals from the dashboard to track them here</p>
            <Link href="/dashboard" className="h-9 px-5 rounded border border-border-subtle font-mono text-[12px] text-secondary hover:text-[#EAEAEF] transition-colors inline-flex items-center">
              Browse Signals
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => {
              const TrendIcon = item.trend === 'up' ? TrendingUp : item.trend === 'down' ? TrendingDown : Minus;
              const trendColor = item.trend === 'up' ? '#00FF88' : item.trend === 'down' ? '#FF3D57' : '#3A3A48';

              return (
                <div key={item.id} className="rounded-lg border border-border-subtle bg-surface hover:border-border-hover transition-all group">
                  <div className="flex items-stretch">
                    {/* Gradient sidebar */}
                    <div className={`w-1.5 rounded-l-lg bg-gradient-to-b ${item.imageGradient || 'from-gray-800 to-gray-950'}`} />

                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <UrgencyBadge urgency={item.urgency} />
                          </div>
                          <Link href={`/dashboard/signal/${item.id}`} className="hover:text-signal transition-colors">
                            <h3 className="font-semibold text-[15px] text-[#EAEAEF] truncate dense-text">{item.itemName}</h3>
                          </Link>
                          <p className="font-mono text-[11px] text-ghost">{item.brand} • {timeAgo(item.createdAt)}</p>

                          {/* Spread mini */}
                          <div className="flex items-center gap-2 mt-2">
                            <PlatformBadge platform={item.buyPlatform} size="xs" />
                            <span className="font-mono text-[12px] text-secondary">{formatCurrency(item.buyPrice)}</span>
                            <span className="text-ghost text-[10px]">→</span>
                            <PlatformBadge platform={item.sellPlatform} size="xs" />
                            <span className="font-mono text-[12px] text-secondary">{formatCurrency(item.sellPrice)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Trend indicator */}
                          <div className="flex items-center gap-1">
                            <TrendIcon size={12} style={{ color: trendColor }} />
                            <span className="font-mono text-[11px]" style={{ color: trendColor }}>
                              {formatPercent(parseFloat(item.trendPct))}
                            </span>
                          </div>

                          {/* Profit */}
                          <div className="text-right">
                            <span className="font-mono text-[20px] font-bold block" style={{ color: '#00FF88' }}>
                              {formatCurrency(item.profit)}
                            </span>
                            <span className="font-mono text-[10px] text-ghost">{formatPercent(item.roi)} ROI</span>
                          </div>

                          <ConfidenceGauge value={item.confidence} size="sm" />
                        </div>
                      </div>

                      {/* Notes */}
                      {(item.notes || editingNote === item.id) && (
                        <div className="mt-3 pt-3 border-t border-border-subtle">
                          {editingNote === item.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                autoFocus
                                value={noteText}
                                onChange={e => setNoteText(e.target.value)}
                                onBlur={() => {
                                  setItems(prev => prev.map(i => i.id === item.id ? { ...i, notes: noteText } : i));
                                  setEditingNote(null);
                                }}
                                onKeyDown={e => e.key === 'Enter' && setEditingNote(null)}
                                placeholder="Add a note..."
                                className="flex-1 h-7 px-2 bg-elevated border border-border-subtle rounded font-mono text-[12px] text-[#EAEAEF] placeholder:text-ghost focus:outline-none focus:border-border-hover"
                              />
                            </div>
                          ) : (
                            <p className="font-mono text-[11px] text-secondary cursor-pointer hover:text-[#EAEAEF] transition-colors"
                              onClick={() => { setEditingNote(item.id); setNoteText(item.notes || ''); }}>
                              📝 {item.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center justify-center gap-2 px-3 border-l border-border-subtle">
                      <button
                        onClick={() => toggleAlert(item.id)}
                        title={item.alertEnabled ? 'Disable alerts' : 'Enable alerts'}
                        className={`w-7 h-7 rounded flex items-center justify-center border transition-colors ${
                          item.alertEnabled
                            ? 'border-gold/30 bg-gold/10 text-gold'
                            : 'border-border-subtle bg-elevated text-ghost hover:text-gold'
                        }`}
                      >
                        {item.alertEnabled ? <Bell size={12} /> : <BellOff size={12} />}
                      </button>
                      <button
                        onClick={() => { setEditingNote(item.id); setNoteText(item.notes || ''); }}
                        className="w-7 h-7 rounded flex items-center justify-center border border-border-subtle bg-elevated text-ghost hover:text-[#EAEAEF] transition-colors"
                      >
                        <StickyNote size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-7 h-7 rounded flex items-center justify-center border border-border-subtle bg-elevated text-ghost hover:text-warning hover:border-warning/30 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
