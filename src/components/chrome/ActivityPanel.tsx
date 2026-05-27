'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, X, Zap, Star, TrendingUp, AlertTriangle, Sparkles, Trophy, Activity, Calendar, Trash2 } from 'lucide-react';
import { useActivity, ActivityKind } from '@/lib/activity-context';
import { cn, timeAgo } from '@/lib/utils';

const ICONS: Record<ActivityKind, any> = {
  signal_new: Zap,
  signal_hot: Sparkles,
  price_drop: TrendingUp,
  social_spike: Activity,
  flip_marked: Trophy,
  watchlist_added: Star,
  drop_alert: Calendar,
  system: AlertTriangle,
  admin: AlertTriangle,
  achievement: Trophy,
};

const COLORS: Record<ActivityKind, string> = {
  signal_new: '#00FF88',
  signal_hot: '#FFB800',
  price_drop: '#00FF88',
  social_spike: '#4D7CFF',
  flip_marked: '#00FF88',
  watchlist_added: '#FFB800',
  drop_alert: '#FF3D57',
  system: '#6B6B7B',
  admin: '#FF3D57',
  achievement: '#FFB800',
};

export function NotificationBell() {
  const { unseenCount, events, markAllSeen, clearAll } = useActivity();
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen(o => {
      if (!o) markAllSeen();
      return !o;
    });
  }

  return (
    <>
      <button
        onClick={toggle}
        className="relative w-7 h-7 rounded border border-border-subtle bg-elevated text-ghost hover:text-[#EAEAEF] flex items-center justify-center transition-colors"
        aria-label="Notifications"
      >
        <Bell size={12} />
        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 rounded-full bg-warning text-[8px] font-mono font-bold text-white flex items-center justify-center">
            {unseenCount > 9 ? '9+' : unseenCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
          <div className="fixed top-12 right-3 sm:right-4 w-[360px] max-w-[calc(100vw-2rem)] z-[61] rounded-lg border border-border-hover bg-surface shadow-2xl overflow-hidden animate-slide-in-right">
            <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-signal" />
                <p className="font-mono text-[12px] font-semibold text-[#EAEAEF]">Activity Feed</p>
                <span className="font-mono text-[10px] text-ghost">· {events.length} events</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { clearAll(); setOpen(false); }} title="Clear all" className="w-6 h-6 rounded border border-border-subtle text-ghost hover:text-warning flex items-center justify-center transition-colors">
                  <Trash2 size={10} />
                </button>
                <button onClick={() => setOpen(false)} className="w-6 h-6 rounded border border-border-subtle text-ghost hover:text-[#EAEAEF] flex items-center justify-center transition-colors">
                  <X size={10} />
                </button>
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {events.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <Bell size={20} className="text-ghost mx-auto mb-2" />
                  <p className="font-mono text-[11px] text-ghost">No activity yet</p>
                  <p className="font-mono text-[10px] text-ghost mt-1">Wraith is scanning · new signals soon</p>
                </div>
              ) : (
                events.map(ev => {
                  const Icon = ICONS[ev.kind];
                  const color = COLORS[ev.kind];
                  const body = (
                    <div className="flex items-start gap-2.5 px-4 py-2.5 border-b border-border-subtle hover:bg-elevated transition-colors">
                      <div
                        className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center mt-0.5"
                        style={{ background: `${color}14`, color }}
                      >
                        <Icon size={11} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('font-mono text-[12px] truncate', ev.seen ? 'text-secondary' : 'text-[#EAEAEF]')}>{ev.title}</p>
                        {ev.body && <p className="font-mono text-[10px] text-ghost truncate">{ev.body}</p>}
                        <p className="font-mono text-[9px] text-ghost mt-0.5">{timeAgo(new Date(ev.at))}</p>
                      </div>
                    </div>
                  );
                  return ev.href ? (
                    <Link key={ev.id} href={ev.href} onClick={() => setOpen(false)} className="block">{body}</Link>
                  ) : (
                    <div key={ev.id}>{body}</div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
