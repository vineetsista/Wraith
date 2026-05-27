export type SignalType = 'arbitrage' | 'price_prediction' | 'social_momentum' | 'sell_signal';
export type Urgency = 'act_now' | 'within_48hrs' | 'watch';
export type Category = 'sneakers' | 'streetwear' | 'trading_cards' | 'vintage' | 'electronics' | 'collectibles';
export type Platform = 'stockx' | 'goat' | 'ebay' | 'mercari' | 'grailed';
export type UserRole = 'user' | 'admin';
export type DifficultyRating = 'easy' | 'medium' | 'hard' | 'near_impossible';

export interface Signal {
  id: string;
  itemName: string;
  brand: string;
  category: Category;
  imageUrl?: string;
  imageGradient?: string;
  buyPlatform: Platform;
  buyPrice: number;
  sellPlatform: Platform;
  sellPrice: number;
  fees: number;
  profit: number;
  roi: number;
  confidence: number;
  urgency: Urgency;
  signalType: SignalType;
  aiNarrative: string;
  socialScore?: number;
  tiktokMentions?: number;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  size?: string;
  condition?: string;
}

export interface WatchedItem {
  id: string;
  userId: string;
  signalId: string;
  signal: Signal;
  alertThresholdProfit?: number;
  alertThresholdConfidence?: number;
  notes?: string;
  isAlerted: boolean;
  createdAt: Date;
}

export interface FlipLog {
  id: string;
  userId: string;
  signalId: string;
  signal?: Signal;
  buyPrice: number;
  sellPrice: number;
  actualProfit: number;
  platform: Platform;
  notes?: string;
  flippedAt: Date;
}

export interface Drop {
  id: string;
  itemName: string;
  brand: string;
  category: Category;
  imageUrl?: string;
  imageGradient?: string;
  retailPrice: number;
  predictedResaleMin: number;
  predictedResaleMax: number;
  predictedProfit: number;
  releasePlatform: string;
  releaseDate: Date;
  difficultyRating: DifficultyRating;
  aiAnalysis: string;
  createdAt: Date;
}

export interface PriceHistory {
  id: string;
  itemName: string;
  platform: Platform;
  price: number;
  recordedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified?: Date;
  discordWebhookUrl?: string;
  minProfit: number;
  minConfidence: number;
  categories: Category[];
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMetrics {
  activeSignals: number;
  avgSpread: number;
  bestSignal: Signal | null;
  marketsScanned: number;
  totalFlipProfit: number;
  sparklines: {
    signals: number[];
    spreads: number[];
  };
}

export interface AnalyticsData {
  totalSignalsViewed: number;
  signalsFlipped: number;
  estimatedProfit: number;
  avgProfitPerFlip: number;
  bestFlipProfit: number;
  winRate: number;
  categoryBreakdown: { category: string; count: number; profit: number }[];
  platformComparison: { platform: string; underpriced: number; avgDiscount: number }[];
  weeklyTrends: { date: string; signals: number; avgSpread: number }[];
  hotItems: { name: string; signalCount: number; avgProfit: number }[];
  socialMomentum: SocialItem[];
}

export interface SocialItem {
  itemName: string;
  brand: string;
  tiktokMentions: number;
  instagramEngagement: number;
  priceImpact: number;
  trend: 'rising' | 'falling' | 'stable';
  currentPrice: number;
}

export interface PlatformInfo {
  id: Platform;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const PLATFORMS: Record<Platform, PlatformInfo> = {
  stockx: { id: 'stockx', name: 'StockX', color: '#00FF00', bgColor: 'rgba(0, 255, 0, 0.08)', borderColor: 'rgba(0, 255, 0, 0.2)' },
  goat: { id: 'goat', name: 'GOAT', color: '#FFFFFF', bgColor: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(255, 255, 255, 0.15)' },
  ebay: { id: 'ebay', name: 'eBay', color: '#E53238', bgColor: 'rgba(229, 50, 56, 0.08)', borderColor: 'rgba(229, 50, 56, 0.2)' },
  mercari: { id: 'mercari', name: 'Mercari', color: '#FF4F00', bgColor: 'rgba(255, 79, 0, 0.08)', borderColor: 'rgba(255, 79, 0, 0.2)' },
  grailed: { id: 'grailed', name: 'Grailed', color: '#CC4444', bgColor: 'rgba(204, 68, 68, 0.08)', borderColor: 'rgba(204, 68, 68, 0.2)' },
};

export const CATEGORIES: Record<Category, { label: string; icon: string }> = {
  sneakers: { label: 'Sneakers', icon: '👟' },
  streetwear: { label: 'Streetwear', icon: '🧥' },
  trading_cards: { label: 'Trading Cards', icon: '🃏' },
  vintage: { label: 'Vintage', icon: '🕰️' },
  electronics: { label: 'Electronics', icon: '📱' },
  collectibles: { label: 'Collectibles', icon: '🎯' },
};
