import { NextRequest, NextResponse } from 'next/server';
import { generateSignalNarrative } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const signal = await req.json();
  const narrative = await generateSignalNarrative(signal);
  return NextResponse.json({ narrative });
}
