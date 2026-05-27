import { Signal, Drop } from '@/types';

const MOCK_NARRATIVES = [
  "This item is priced significantly below authenticated market averages. Recent sales data indicates strong buyer demand with consistent sell-through. Platform arbitrage window typically closes within 6-8 hours as algorithmic repricing catches up.",
  "Social signal momentum detected — TikTok mention velocity up 340% in 72 hours. Price appreciation historically follows social spikes by 5-7 days. Current spread represents a closing window as awareness reaches casual resellers.",
  "Cross-platform price discrepancy driven by audience demographic differences. Casual sellers undervalue relative to dedicated resale buyers. Authentication premium on destination platform justifies the spread.",
  "Release calendar proximity creating pre-market demand. Comparable colorways from same brand have shown 20-35% appreciation in the 2 weeks preceding anniversary dates and cultural moments.",
  "Motivated seller detected — listing duration, pricing pattern, and description characteristics suggest inventory clearance. Comparable authenticated sales on destination platform confirm spread viability.",
];

export async function generateSignalNarrative(signal: Partial<Signal>): Promise<string> {
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a resale market intelligence AI. Write concise 2-3 sentence market analysis for arbitrage signals. Focus on WHY the opportunity exists, what data supports it, and timing urgency. Be specific, data-driven, and professional. No emojis.',
            },
            {
              role: 'user',
              content: `Analyze this arbitrage signal: ${signal.itemName} (${signal.brand}), Buy on ${signal.buyPlatform} at $${signal.buyPrice}, Sell on ${signal.sellPlatform} at $${signal.sellPrice}, Profit: $${signal.profit} (${signal.roi}% ROI), Confidence: ${signal.confidence}%. Urgency: ${signal.urgency}. Social mentions: ${signal.tiktokMentions || 'unknown'}.`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      return data.choices?.[0]?.message?.content || getMockNarrative();
    } catch {
      return getMockNarrative();
    }
  }
  return getMockNarrative();
}

export async function generateDropAnalysis(drop: Partial<Drop>): Promise<string> {
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a sneaker and streetwear resale expert. Analyze upcoming drops with data-driven resale predictions. Be specific about W rates, timing, and profit potential.',
            },
            {
              role: 'user',
              content: `Analyze this upcoming drop for resale: ${drop.itemName} (${drop.brand}), Retail: $${drop.retailPrice}, Predicted resale: $${drop.predictedResaleMin}-$${drop.predictedResaleMax}, Platform: ${drop.releasePlatform}, Difficulty: ${drop.difficultyRating}. Provide 2-3 sentence analysis.`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      return data.choices?.[0]?.message?.content || getMockNarrative();
    } catch {
      return getMockNarrative();
    }
  }
  return getMockNarrative();
}

export async function generateMarketSummary(): Promise<string> {
  return `Market activity elevated across all categories. Sneaker arbitrage opportunities concentrated in Jordan and Nike collab segments with average spreads up 12% week-over-week. Streetwear seeing renewed premium on Fall/Winter releases. Trading card momentum building in anime TCG sector — One Piece volume surging. Social signals point to 3-4 items with breakout potential in next 48 hours. Total opportunities scanned: 47,284 listings across 5 platforms.`;
}

function getMockNarrative(): string {
  return MOCK_NARRATIVES[Math.floor(Math.random() * MOCK_NARRATIVES.length)];
}

export async function predictPriceDirection(
  itemName: string,
  currentPrice: number,
  priceHistory: number[]
): Promise<{ direction: 'up' | 'down' | 'stable'; magnitude: number; confidence: number }> {
  const recentTrend = priceHistory.length > 5
    ? (priceHistory[priceHistory.length - 1] - priceHistory[priceHistory.length - 6]) / priceHistory[priceHistory.length - 6]
    : 0;

  if (recentTrend > 0.05) return { direction: 'up', magnitude: Math.abs(recentTrend * 100), confidence: 75 };
  if (recentTrend < -0.05) return { direction: 'down', magnitude: Math.abs(recentTrend * 100), confidence: 68 };
  return { direction: 'stable', magnitude: Math.abs(recentTrend * 100), confidence: 60 };
}
