import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Platform, Category, Urgency, SignalType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function timeUntil(date: Date): string {
  const seconds = Math.floor((new Date(date).getTime() - Date.now()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    stockx: 'StockX',
    goat: 'GOAT',
    ebay: 'eBay',
    mercari: 'Mercari',
    grailed: 'Grailed',
  };
  return labels[platform] || platform;
}

export function getPlatformColor(platform: Platform): string {
  const colors: Record<Platform, string> = {
    stockx: '#00FF00',
    goat: '#FFFFFF',
    ebay: '#E53238',
    mercari: '#FF4F00',
    grailed: '#CC4444',
  };
  return colors[platform] || '#6B6B7B';
}

export function getPlatformBg(platform: Platform): string {
  const bgs: Record<Platform, string> = {
    stockx: 'rgba(0, 255, 0, 0.1)',
    goat: 'rgba(255, 255, 255, 0.08)',
    ebay: 'rgba(229, 50, 56, 0.1)',
    mercari: 'rgba(255, 79, 0, 0.1)',
    grailed: 'rgba(204, 68, 68, 0.1)',
  };
  return bgs[platform] || 'rgba(107, 107, 123, 0.1)';
}

export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    sneakers: 'Sneakers',
    streetwear: 'Streetwear',
    trading_cards: 'Trading Cards',
    vintage: 'Vintage',
    electronics: 'Electronics',
    collectibles: 'Collectibles',
  };
  return labels[category] || category;
}

export function getUrgencyConfig(urgency: Urgency) {
  const configs = {
    act_now: { label: 'ACT NOW', color: '#FF3D57', bg: 'rgba(255, 61, 87, 0.1)', pulse: true },
    within_48hrs: { label: 'WITHIN 48HRS', color: '#FFB800', bg: 'rgba(255, 184, 0, 0.1)', pulse: false },
    watch: { label: 'WATCH', color: '#6B6B7B', bg: 'rgba(107, 107, 123, 0.1)', pulse: false },
  };
  return configs[urgency];
}

export function getSignalTypeConfig(type: SignalType) {
  const configs = {
    arbitrage: { label: 'ARB', color: '#00FF88', bg: 'rgba(0, 255, 136, 0.1)' },
    price_prediction: { label: 'PRED', color: '#4D7CFF', bg: 'rgba(77, 124, 255, 0.1)' },
    social_momentum: { label: 'SOCIAL', color: '#FFB800', bg: 'rgba(255, 184, 0, 0.1)' },
    sell_signal: { label: 'SELL', color: '#FF3D57', bg: 'rgba(255, 61, 87, 0.1)' },
  };
  return configs[type];
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return '#00FF88';
  if (confidence >= 70) return '#00FF88';
  if (confidence >= 50) return '#FFB800';
  return '#3A3A48';
}

export function getConfidenceGlow(confidence: number): string {
  if (confidence >= 90) return 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.5))';
  if (confidence >= 70) return 'drop-shadow(0 0 4px rgba(0, 255, 136, 0.2))';
  if (confidence >= 50) return 'drop-shadow(0 0 4px rgba(255, 184, 0, 0.2))';
  return 'none';
}

export function calculateFees(platform: Platform, price: number): number {
  const feeRates: Record<Platform, number> = {
    stockx: 0.095,
    goat: 0.095,
    ebay: 0.129,
    mercari: 0.1,
    grailed: 0.09,
  };
  return Math.round(price * (feeRates[platform] || 0.1));
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}
