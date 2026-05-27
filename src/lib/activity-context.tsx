'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, ReactNode } from 'react';
import { useWraith } from './wraith-context';

export type ActivityKind =
  | 'signal_new'
  | 'signal_hot'
  | 'price_drop'
  | 'social_spike'
  | 'flip_marked'
  | 'watchlist_added'
  | 'drop_alert'
  | 'system'
  | 'admin'
  | 'achievement';

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  title: string;
  body?: string;
  href?: string;
  meta?: Record<string, string | number>;
  at: number;
  seen: boolean;
}

interface ActivityContextValue {
  events: ActivityEvent[];
  unseenCount: number;
  toasts: ActivityEvent[];
  push: (e: Omit<ActivityEvent, 'id' | 'at' | 'seen'>) => void;
  dismiss: (id: string) => void;
  dismissToast: (id: string) => void;
  markAllSeen: () => void;
  clearAll: () => void;
}

const ActivityContext = createContext<ActivityContextValue | null>(null);

let counter = 0;
function nextId() {
  counter += 1;
  return `act_${Date.now()}_${counter}`;
}

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [toasts, setToasts] = useState<ActivityEvent[]>([]);
  const { soundEnabled, notificationsEnabled } = useWraith();
  const audioCtx = useRef<AudioContext | null>(null);

  const playPing = useCallback((freq = 880) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtx.current) {
        const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
        audioCtx.current = new Ctx();
      }
      const ctx = audioCtx.current!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  const push = useCallback((e: Omit<ActivityEvent, 'id' | 'at' | 'seen'>) => {
    const ev: ActivityEvent = { ...e, id: nextId(), at: Date.now(), seen: false };
    setEvents(prev => [ev, ...prev].slice(0, 200));
    if (notificationsEnabled) {
      setToasts(prev => [ev, ...prev].slice(0, 4));
      const freq = e.kind === 'signal_hot' ? 1200 : e.kind === 'price_drop' ? 700 : 880;
      playPing(freq);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== ev.id)), 5200);
    }
  }, [playPing, notificationsEnabled]);

  const dismiss = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setToasts(prev => prev.filter(e => e.id !== id));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(e => e.id !== id));
  }, []);

  const markAllSeen = useCallback(() => {
    setEvents(prev => prev.map(e => ({ ...e, seen: true })));
  }, []);

  const clearAll = useCallback(() => {
    setEvents([]);
    setToasts([]);
  }, []);

  const value = useMemo<ActivityContextValue>(
    () => ({
      events,
      unseenCount: events.filter(e => !e.seen).length,
      toasts,
      push,
      dismiss,
      dismissToast,
      markAllSeen,
      clearAll,
    }),
    [events, toasts, push, dismiss, dismissToast, markAllSeen, clearAll],
  );

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error('useActivity must be used within ActivityProvider');
  return ctx;
}

