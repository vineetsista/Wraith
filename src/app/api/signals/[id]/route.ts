import { NextRequest, NextResponse } from 'next/server';
import { MOCK_SIGNALS } from '@/lib/mock-data';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const signal = MOCK_SIGNALS.find(s => s.id === params.id);
  if (!signal) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(signal);
}
