import { NextResponse } from 'next/server';
import { MOCK_DROPS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ drops: MOCK_DROPS, total: MOCK_DROPS.length });
}
