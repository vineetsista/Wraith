'use client';

import { useEffect, useRef, useState } from 'react';
import { Signal } from '@/types';

interface SSEState {
  signals: Signal[];
  connected: boolean;
  error: string | null;
}

export function useSSE(endpoint: string, enabled = true): SSEState {
  const [state, setState] = useState<SSEState>({
    signals: [],
    connected: false,
    error: null,
  });
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const connect = () => {
      eventSourceRef.current = new EventSource(endpoint);

      eventSourceRef.current.onopen = () => {
        setState(prev => ({ ...prev, connected: true, error: null }));
      };

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'signal') {
            setState(prev => ({
              ...prev,
              signals: [data.signal, ...prev.signals].slice(0, 50),
            }));
          }
        } catch {
          // ignore parse errors
        }
      };

      eventSourceRef.current.onerror = () => {
        setState(prev => ({ ...prev, connected: false, error: 'Connection lost' }));
        eventSourceRef.current?.close();
        // Reconnect after 5s
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      eventSourceRef.current?.close();
    };
  }, [endpoint, enabled]);

  return state;
}
