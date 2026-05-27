import { MOCK_SIGNALS } from './mock-data';
import { Platform } from '@/types';

export type FlipStatus = 'open' | 'sold' | 'monitoring' | 'cancelled';

export interface PortfolioFlip {
  id: string;
  itemName: string;
  brand: string;
  category: string;
  buyPlatform: Platform;
  sellPlatform: Platform;
  buyPrice: number;
  listPrice?: number;
  soldPrice?: number;
  feesPaid: number;
  profit: number;
  status: FlipStatus;
  boughtAt: Date;
  soldAt?: Date;
  signalId?: string;
  daysHeld?: number;
  confidence?: number;
}

const NOW = Date.now();

function d(daysAgo: number) {
  return new Date(NOW - daysAgo * 24 * 60 * 60 * 1000);
}

const SOURCE: PortfolioFlip[] = [
  {
    id: 'flp_001',
    itemName: 'Jordan 4 Bred Reimagined',
    brand: 'Jordan',
    category: 'sneakers',
    buyPlatform: 'mercari',
    sellPlatform: 'stockx',
    buyPrice: 198,
    soldPrice: 271,
    feesPaid: 28,
    profit: 45,
    status: 'sold',
    boughtAt: d(14),
    soldAt: d(11),
    daysHeld: 3,
    confidence: 94,
    signalId: 'sig_001',
  },
  {
    id: 'flp_002',
    itemName: 'Supreme Box Logo Hoodie FW24',
    brand: 'Supreme',
    category: 'streetwear',
    buyPlatform: 'grailed',
    sellPlatform: 'stockx',
    buyPrice: 340,
    soldPrice: 502,
    feesPaid: 49,
    profit: 113,
    status: 'sold',
    boughtAt: d(20),
    soldAt: d(16),
    daysHeld: 4,
    confidence: 91,
    signalId: 'sig_003',
  },
  {
    id: 'flp_003',
    itemName: 'Travis Scott x Nike Air Max 1',
    brand: 'Nike',
    category: 'sneakers',
    buyPlatform: 'grailed',
    sellPlatform: 'stockx',
    buyPrice: 860,
    soldPrice: 1245,
    feesPaid: 124,
    profit: 261,
    status: 'sold',
    boughtAt: d(28),
    soldAt: d(22),
    daysHeld: 6,
    confidence: 88,
  },
  {
    id: 'flp_004',
    itemName: 'Yeezy 350 V2 "Bone"',
    brand: 'Adidas',
    category: 'sneakers',
    buyPlatform: 'mercari',
    sellPlatform: 'goat',
    buyPrice: 178,
    soldPrice: 232,
    feesPaid: 24,
    profit: 30,
    status: 'sold',
    boughtAt: d(35),
    soldAt: d(31),
    daysHeld: 4,
    confidence: 76,
    signalId: 'sig_004',
  },
  {
    id: 'flp_005',
    itemName: 'Wembanyama Prizm RC',
    brand: 'Panini',
    category: 'trading_cards',
    buyPlatform: 'ebay',
    sellPlatform: 'ebay',
    buyPrice: 187,
    soldPrice: 285,
    feesPaid: 36,
    profit: 62,
    status: 'sold',
    boughtAt: d(40),
    soldAt: d(33),
    daysHeld: 7,
    confidence: 82,
  },
  {
    id: 'flp_006',
    itemName: 'New Balance 2002R Protection Pack',
    brand: 'New Balance',
    category: 'sneakers',
    buyPlatform: 'mercari',
    sellPlatform: 'stockx',
    buyPrice: 162,
    soldPrice: 215,
    feesPaid: 21,
    profit: 32,
    status: 'sold',
    boughtAt: d(45),
    soldAt: d(42),
    daysHeld: 3,
    confidence: 84,
  },
  {
    id: 'flp_007',
    itemName: 'Stüssy Basic Tee Pack',
    brand: 'Stüssy',
    category: 'streetwear',
    buyPlatform: 'grailed',
    sellPlatform: 'grailed',
    buyPrice: 95,
    soldPrice: 168,
    feesPaid: 14,
    profit: 59,
    status: 'sold',
    boughtAt: d(50),
    soldAt: d(46),
    daysHeld: 4,
    confidence: 71,
  },
  {
    id: 'flp_008',
    itemName: 'Kith x Versace Crewneck',
    brand: 'Kith',
    category: 'streetwear',
    buyPlatform: 'grailed',
    sellPlatform: 'stockx',
    buyPrice: 360,
    soldPrice: 478,
    feesPaid: 46,
    profit: 72,
    status: 'sold',
    boughtAt: d(58),
    soldAt: d(53),
    daysHeld: 5,
    confidence: 79,
  },
  {
    id: 'flp_009',
    itemName: 'Charizard Holo PSA 9',
    brand: 'Pokémon',
    category: 'trading_cards',
    buyPlatform: 'mercari',
    sellPlatform: 'ebay',
    buyPrice: 410,
    soldPrice: 624,
    feesPaid: 80,
    profit: 134,
    status: 'sold',
    boughtAt: d(62),
    soldAt: d(55),
    daysHeld: 7,
    confidence: 86,
  },
  {
    id: 'flp_010',
    itemName: 'Carhartt WIP OG Active Jacket',
    brand: 'Carhartt WIP',
    category: 'streetwear',
    buyPlatform: 'grailed',
    sellPlatform: 'grailed',
    buyPrice: 110,
    soldPrice: 175,
    feesPaid: 16,
    profit: 49,
    status: 'sold',
    boughtAt: d(70),
    soldAt: d(64),
    daysHeld: 6,
    confidence: 73,
  },
  // Open positions (live)
  {
    id: 'flp_011',
    itemName: 'Nike SB Dunk Low "Paris"',
    brand: 'Nike SB',
    category: 'sneakers',
    buyPlatform: 'ebay',
    sellPlatform: 'goat',
    buyPrice: 1240,
    listPrice: 1580,
    feesPaid: 0,
    profit: 0,
    status: 'open',
    boughtAt: d(3),
    confidence: 88,
    signalId: 'sig_002',
  },
  {
    id: 'flp_012',
    itemName: 'Jordan 1 High "Spider-Verse"',
    brand: 'Jordan',
    category: 'sneakers',
    buyPlatform: 'mercari',
    sellPlatform: 'stockx',
    buyPrice: 220,
    listPrice: 320,
    feesPaid: 0,
    profit: 0,
    status: 'open',
    boughtAt: d(5),
    confidence: 85,
  },
  {
    id: 'flp_013',
    itemName: 'Supreme x TNF Jacket',
    brand: 'Supreme x TNF',
    category: 'streetwear',
    buyPlatform: 'grailed',
    sellPlatform: 'stockx',
    buyPrice: 480,
    listPrice: 680,
    feesPaid: 0,
    profit: 0,
    status: 'monitoring',
    boughtAt: d(2),
    confidence: 90,
    signalId: 'sig_030',
  },
];

export function getPortfolioFlips(): PortfolioFlip[] {
  return SOURCE;
}

export function getPortfolioStats(flips: PortfolioFlip[]) {
  const sold = flips.filter(f => f.status === 'sold');
  const open = flips.filter(f => f.status === 'open' || f.status === 'monitoring');
  const realizedProfit = sold.reduce((sum, f) => sum + f.profit, 0);
  const capitalDeployed = open.reduce((sum, f) => sum + f.buyPrice, 0);
  const projectedProfit = open.reduce((sum, f) => sum + Math.max((f.listPrice ?? f.buyPrice) - f.buyPrice - Math.round((f.listPrice ?? f.buyPrice) * 0.09), 0), 0);
  const wins = sold.filter(f => f.profit > 0).length;
  const winRate = sold.length ? (wins / sold.length) * 100 : 0;
  const totalRevenue = sold.reduce((sum, f) => sum + (f.soldPrice ?? 0), 0);
  const totalCost = sold.reduce((sum, f) => sum + f.buyPrice + f.feesPaid, 0);
  const avgProfit = sold.length ? realizedProfit / sold.length : 0;
  const avgDaysHeld = sold.length ? sold.reduce((s, f) => s + (f.daysHeld ?? 0), 0) / sold.length : 0;
  const bestFlip = sold.reduce((best, f) => (f.profit > (best?.profit ?? 0) ? f : best), sold[0]);

  return {
    realizedProfit,
    capitalDeployed,
    projectedProfit,
    winRate,
    totalRevenue,
    totalCost,
    avgProfit,
    avgDaysHeld,
    bestFlip,
    soldCount: sold.length,
    openCount: open.length,
  };
}

export function getMonthlyPerformance(flips: PortfolioFlip[]) {
  const months: Record<string, { month: string; profit: number; flips: number }> = {};
  const labels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toISOString().slice(0, 7);
    months[key] = { month: labels[d.getMonth()], profit: 0, flips: 0 };
  }
  flips.filter(f => f.status === 'sold' && f.soldAt).forEach(f => {
    const key = f.soldAt!.toISOString().slice(0, 7);
    if (months[key]) {
      months[key].profit += f.profit;
      months[key].flips += 1;
    }
  });
  // backfill earlier months with synthetic data so chart isn't sparse
  const series = Object.values(months);
  series.forEach((m, i) => {
    if (m.profit === 0 && i < series.length - 1) {
      m.profit = 320 + Math.floor(Math.random() * 480);
      m.flips = 3 + Math.floor(Math.random() * 6);
    }
  });
  return series;
}

export function getCategoryPerformance(flips: PortfolioFlip[]) {
  const cats: Record<string, { category: string; profit: number; flips: number }> = {};
  flips.filter(f => f.status === 'sold').forEach(f => {
    if (!cats[f.category]) cats[f.category] = { category: f.category, profit: 0, flips: 0 };
    cats[f.category].profit += f.profit;
    cats[f.category].flips += 1;
  });
  return Object.values(cats).sort((a, b) => b.profit - a.profit);
}

// pull a couple example signals to relate to
export const RECENT_SIGNAL_IDS = MOCK_SIGNALS.slice(0, 6).map(s => s.id);
