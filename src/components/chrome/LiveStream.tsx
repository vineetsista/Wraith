'use client';

import { useEffect, useRef } from 'react';
import { useActivity } from '@/lib/activity-context';
import { useWraith } from '@/lib/wraith-context';
import { MOCK_SIGNALS } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

// Pool of plausible live events that drift in over time
const STREAM_EVENTS: Array<{
  weight: number;
  build: () => {
    kind: 'signal_new' | 'signal_hot' | 'price_drop' | 'social_spike' | 'drop_alert' | 'achievement';
    title: string;
    body?: string;
    href?: string;
    meta?: Record<string, string | number>;
  };
}> = [
  {
    weight: 8,
    build: () => {
      const s = MOCK_SIGNALS[Math.floor(Math.random() * MOCK_SIGNALS.length)];
      const hot = s.confidence >= 88;
      return {
        kind: hot ? 'signal_hot' : 'signal_new',
        title: `New signal · ${s.itemName}`,
        body: `${s.buyPlatform} → ${s.sellPlatform} · ${s.confidence}% confidence`,
        href: `/dashboard/signal/${s.id}`,
        meta: { profit: formatCurrency(s.profit), ROI: `${s.roi.toFixed(1)}%` },
      };
    },
  },
  {
    weight: 4,
    build: () => {
      const s = MOCK_SIGNALS[Math.floor(Math.random() * MOCK_SIGNALS.length)];
      const drop = 3 + Math.floor(Math.random() * 15);
      return {
        kind: 'price_drop',
        title: `Price drop · ${s.itemName}`,
        body: `${s.buyPlatform} listing dropped ${drop}% in last hour`,
        href: `/dashboard/signal/${s.id}`,
        meta: { spread: `+$${Math.floor(s.profit * 1.1)}` },
      };
    },
  },
  {
    weight: 3,
    build: () => {
      const s = MOCK_SIGNALS[Math.floor(Math.random() * MOCK_SIGNALS.length)];
      const lift = 120 + Math.floor(Math.random() * 380);
      return {
        kind: 'social_spike',
        title: `Social spike · ${s.brand}`,
        body: `TikTok mentions +${lift}% in 6h · momentum building`,
        href: `/dashboard/signal/${s.id}`,
      };
    },
  },
  {
    weight: 1,
    build: () => ({
      kind: 'drop_alert',
      title: 'Drop in 24h · Travis Scott Jordan 1',
      body: 'Predicted resale: $1,840–$2,300 · Difficulty: hard',
      href: '/dashboard/drops',
    }),
  },
  {
    weight: 1,
    build: () => {
      const profit = 80 + Math.floor(Math.random() * 240);
      return {
        kind: 'achievement',
        title: 'Streak: 7 profitable flips',
        body: `Estimated profit ${formatCurrency(profit)} this week`,
      };
    },
  },
];

function weightedPick() {
  const total = STREAM_EVENTS.reduce((a, e) => a + e.weight, 0);
  let r = Math.random() * total;
  for (const e of STREAM_EVENTS) {
    r -= e.weight;
    if (r <= 0) return e.build();
  }
  return STREAM_EVENTS[0].build();
}

export default function LiveStream() {
  const { push } = useActivity();
  const { liveMode, demoMode } = useWraith();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    function clear() {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    }

    if (!liveMode) {
      clear();
      return;
    }

    function schedule(initial = false) {
      const delay = initial ? 4000 + Math.random() * 4000 : 15000 + Math.random() * 28000;
      timer.current = setTimeout(() => {
        const ev = weightedPick();
        push(ev);
        schedule(false);
      }, delay);
    }

    // Seed a couple of events on first activation so the feed isn't empty
    if (!startedRef.current && demoMode) {
      startedRef.current = true;
      setTimeout(() => push(weightedPick()), 1500);
      setTimeout(() => push(weightedPick()), 5200);
    }

    schedule(true);
    return clear;
  }, [liveMode, demoMode, push]);

  return null;
}
