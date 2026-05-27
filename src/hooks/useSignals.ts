'use client';

import { useState, useCallback, useMemo } from 'react';
import { Signal, Category, Platform, SignalType, Urgency } from '@/types';

interface Filters {
  category?: Category | 'all';
  platform?: Platform | 'all';
  minProfit: number;
  minConfidence: number;
  signalType?: SignalType | 'all';
  urgency?: Urgency | 'all';
  sortBy: 'confidence' | 'profit' | 'newest' | 'expiring';
  search: string;
}

const DEFAULT_FILTERS: Filters = {
  category: 'all',
  platform: 'all',
  minProfit: 0,
  minConfidence: 0,
  signalType: 'all',
  urgency: 'all',
  sortBy: 'confidence',
  search: '',
};

export function useSignals(initialSignals: Signal[]) {
  const [signals, setSignals] = useState<Signal[]>(initialSignals);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [flipped, setFlipped] = useState<Set<string>>(new Set());

  const filteredSignals = useMemo(() => {
    let result = signals.filter(s => !dismissed.has(s.id) && s.isActive);

    if (filters.category && filters.category !== 'all') {
      result = result.filter(s => s.category === filters.category);
    }
    if (filters.platform && filters.platform !== 'all') {
      result = result.filter(s => s.buyPlatform === filters.platform || s.sellPlatform === filters.platform);
    }
    if (filters.minProfit > 0) {
      result = result.filter(s => s.profit >= filters.minProfit);
    }
    if (filters.minConfidence > 0) {
      result = result.filter(s => s.confidence >= filters.minConfidence);
    }
    if (filters.signalType && filters.signalType !== 'all') {
      result = result.filter(s => s.signalType === filters.signalType);
    }
    if (filters.urgency && filters.urgency !== 'all') {
      result = result.filter(s => s.urgency === filters.urgency);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(s =>
        s.itemName.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q)
      );
    }

    switch (filters.sortBy) {
      case 'confidence':
        result.sort((a, b) => b.confidence - a.confidence);
        break;
      case 'profit':
        result.sort((a, b) => b.profit - a.profit);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'expiring':
        result.sort((a, b) => {
          const urgencyOrder = { act_now: 0, within_48hrs: 1, watch: 2 };
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        });
        break;
    }

    return result;
  }, [signals, filters, dismissed]);

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const dismissSignal = useCallback((id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  }, []);

  const toggleWatch = useCallback((id: string) => {
    setWatched(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleFlip = useCallback((id: string) => {
    setFlipped(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const addSignal = useCallback((signal: Signal) => {
    setSignals(prev => [signal, ...prev]);
  }, []);

  return {
    signals: filteredSignals,
    allSignals: signals,
    filters,
    updateFilter,
    resetFilters,
    dismissSignal,
    toggleWatch,
    toggleFlip,
    addSignal,
    watched,
    flipped,
    stats: {
      total: signals.filter(s => s.isActive).length,
      filtered: filteredSignals.length,
      dismissed: dismissed.size,
    },
  };
}
