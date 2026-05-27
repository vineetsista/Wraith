'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Keyboard, X } from 'lucide-react';
import { useCommandPalette } from '@/lib/command-palette-context';
import { useAssistant } from '@/lib/assistant-context';

const SHORTCUTS = [
  { keys: ['⌘', 'K'], action: 'Open command palette' },
  { keys: ['⌘', 'J'], action: 'Open Wraith Intelligence' },
  { keys: ['/'], action: 'Focus search palette' },
  { keys: ['?'], action: 'Show this help' },
  { keys: ['G', 'S'], action: 'Go to Signals' },
  { keys: ['G', 'W'], action: 'Go to Watchlist' },
  { keys: ['G', 'P'], action: 'Go to Portfolio' },
  { keys: ['G', 'A'], action: 'Go to Analytics' },
  { keys: ['G', 'D'], action: 'Go to Drops' },
  { keys: ['G', 'X'], action: 'Go to Admin (admin only)' },
  { keys: ['Shift', 'M'], action: 'Activate Money Mode 💸' },
  { keys: ['Esc'], action: 'Close any overlay' },
];

const NAV_KEYS: Record<string, string> = {
  s: '/dashboard',
  w: '/dashboard/watchlist',
  p: '/dashboard/portfolio',
  a: '/dashboard/analytics',
  d: '/dashboard/drops',
  ',': '/dashboard/settings',
  x: '/dashboard/admin',
};

export default function KeyboardShortcuts() {
  const router = useRouter();
  const { setOpen: setCmd } = useCommandPalette();
  const { setOpen: setAi } = useAssistant();
  const [helpOpen, setHelpOpen] = useState(false);
  const [pendingG, setPendingG] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const inField = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;
      if (inField || e.metaKey || e.ctrlKey || e.altKey) {
        if (pendingG) setPendingG(false);
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setHelpOpen(true);
        return;
      }

      if (pendingG) {
        const dest = NAV_KEYS[e.key.toLowerCase()];
        if (dest) {
          e.preventDefault();
          router.push(dest);
        }
        setPendingG(false);
        return;
      }

      if (e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setPendingG(true);
        setTimeout(() => setPendingG(p => (p ? false : p)), 1200);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pendingG, router, setCmd, setAi]);

  return (
    <>
      {pendingG && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[80] px-3 py-2 rounded border border-border-hover bg-surface shadow-xl animate-fade-in">
          <p className="font-mono text-[11px] text-secondary">
            <kbd className="px-1.5 py-0.5 rounded border border-border-subtle text-[10px] mr-1">G</kbd> then{' '}
            <kbd className="px-1.5 py-0.5 rounded border border-border-subtle text-[10px] mx-0.5">S/W/P/A/D/X/,</kbd> to navigate
          </p>
        </div>
      )}

      {helpOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4" onClick={() => setHelpOpen(false)} style={{ background: 'rgba(5,5,7,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md rounded-xl border border-border-hover bg-surface p-6 animate-slide-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Keyboard size={14} className="text-signal" />
                <h2 className="font-serif text-[18px] text-[#EAEAEF]">Keyboard shortcuts</h2>
              </div>
              <button onClick={() => setHelpOpen(false)} className="w-7 h-7 rounded border border-border-subtle text-ghost hover:text-[#EAEAEF] flex items-center justify-center transition-colors">
                <X size={12} />
              </button>
            </div>
            <div className="space-y-1.5">
              {SHORTCUTS.map(s => (
                <div key={s.action} className="flex items-center justify-between py-1.5 border-b border-border-subtle last:border-0">
                  <span className="font-mono text-[12px] text-secondary">{s.action}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border-hover bg-elevated text-[#EAEAEF]">{k}</kbd>
                        {i < s.keys.length - 1 && <span className="font-mono text-[10px] text-ghost">+</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="font-mono text-[10px] text-ghost mt-4 text-center">Press <kbd className="px-1 rounded border border-border-subtle">?</kbd> anytime · <kbd className="px-1 rounded border border-border-subtle">Esc</kbd> to close</p>
          </div>
        </div>
      )}
    </>
  );
}
