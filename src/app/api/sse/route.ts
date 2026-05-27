import { NextRequest } from 'next/server';
import { MOCK_SIGNALS } from '@/lib/mock-data';

export const runtime = 'edge';

export async function GET(_req: NextRequest) {
  const encoder = new TextEncoder();
  let intervalId: ReturnType<typeof setInterval>;
  let counter = 0;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode('data: {"type":"connected","message":"Wraith SSE connected"}\n\n'));

      // Simulate new signals every 20s
      intervalId = setInterval(() => {
        counter++;
        const randomSignal = MOCK_SIGNALS[Math.floor(Math.random() * MOCK_SIGNALS.length)];
        const signal = {
          ...randomSignal,
          id: `sse_${counter}_${Date.now()}`,
          createdAt: new Date(),
        };

        const data = JSON.stringify({ type: 'signal', signal });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }, 20000);
    },
    cancel() {
      clearInterval(intervalId);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
