import { NextRequest, NextResponse } from 'next/server';
import { MOCK_SIGNALS } from '@/lib/mock-data';
import { Category, Platform, SignalType, Urgency } from '@/types';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const category = url.searchParams.get('category') as Category | null;
  const platform = url.searchParams.get('platform') as Platform | null;
  const signalType = url.searchParams.get('type') as SignalType | null;
  const urgency = url.searchParams.get('urgency') as Urgency | null;
  const minProfit = parseInt(url.searchParams.get('minProfit') || '0');
  const minConfidence = parseInt(url.searchParams.get('minConfidence') || '0');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  let signals = MOCK_SIGNALS.filter(s => s.isActive);

  if (category) signals = signals.filter(s => s.category === category);
  if (platform) signals = signals.filter(s => s.buyPlatform === platform || s.sellPlatform === platform);
  if (signalType) signals = signals.filter(s => s.signalType === signalType);
  if (urgency) signals = signals.filter(s => s.urgency === urgency);
  if (minProfit > 0) signals = signals.filter(s => s.profit >= minProfit);
  if (minConfidence > 0) signals = signals.filter(s => s.confidence >= minConfidence);

  signals.sort((a, b) => b.confidence - a.confidence);

  return NextResponse.json({
    signals: signals.slice(offset, offset + limit),
    total: signals.length,
    offset,
    limit,
  });
}
