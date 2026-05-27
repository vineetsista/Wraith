'use client';

import Link from 'next/link';
import { Zap, Star, TrendingUp, AlertTriangle, Sparkles, X, Trophy, Activity, Calendar } from 'lucide-react';
import { useActivity, ActivityKind } from '@/lib/activity-context';
import { cn } from '@/lib/utils';

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

const COLORS: Record<ActivityKind, { fg: string; bg: string; border: string }> = {
  signal_new: { fg: '#00FF88', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.3)' },
  signal_hot: { fg: '#FFB800', bg: 'rgba(255,184,0,0.08)', border: 'rgba(255,184,0,0.3)' },
  price_drop: { fg: '#00FF88', bg: 'rgba(0,255,136,0.06)', border: 'rgba(0,255,136,0.25)' },
  social_spike: { fg: '#4D7CFF', bg: 'rgba(77,124,255,0.08)', border: 'rgba(77,124,255,0.3)' },
  flip_marked: { fg: '#00FF88', bg: 'rgba(0,255,136,0.06)', border: 'rgba(0,255,136,0.25)' },
  watchlist_added: { fg: '#FFB800', bg: 'rgba(255,184,0,0.06)', border: 'rgba(255,184,0,0.25)' },
  drop_alert: { fg: '#FF3D57', bg: 'rgba(255,61,87,0.06)', border: 'rgba(255,61,87,0.3)' },
  system: { fg: '#6B6B7B', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.12)' },
  admin: { fg: '#FF3D57', bg: 'rgba(255,61,87,0.06)', border: 'rgba(255,61,87,0.3)' },
  achievement: { fg: '#FFB800', bg: 'rgba(255,184,0,0.08)', border: 'rgba(255,184,0,0.3)' },
};

export default function ToastStack() {
  const { toasts, dismissToast } = useActivity();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[80] flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(t => {
        const Icon = ICONS[t.kind];
        const c = COLORS[t.kind];
        const body = (
          <div
            key={t.id}
            className="pointer-events-auto rounded-lg border bg-surface backdrop-blur-md px-3 py-2.5 flex items-start gap-2.5 min-w-[280px] animate-slide-in-right"
            style={{ borderColor: c.border, boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${c.border}` }}
          >
            <div
              className="w-7 h-7 rounded flex-shrink-0 flex items-center justify-center"
              style={{ background: c.bg, color: c.fg }}
            >
              <Icon size={13} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[12px] font-semibold text-[#EAEAEF] truncate">{t.title}</p>
              {t.body && <p className="font-mono text-[11px] text-secondary mt-0.5 line-clamp-2">{t.body}</p>}
              {t.meta && (
                <div className="flex items-center gap-2 mt-1.5">
                  {Object.entries(t.meta).map(([k, v]) => (
                    <span key={k} className="font-mono text-[10px] text-ghost">
                      <span className="text-ghost">{k}:</span> <span style={{ color: c.fg }}>{v}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); dismissToast(t.id); }}
              className="text-ghost hover:text-[#EAEAEF] flex-shrink-0"
            >
              <X size={11} />
            </button>
          </div>
        );
        return t.href ? (
          <Link key={t.id} href={t.href} onClick={() => dismissToast(t.id)}>
            {body}
          </Link>
        ) : body;
      })}
    </div>
  );
}
