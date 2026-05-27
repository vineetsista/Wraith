'use client';

import { Sparkles, Command } from 'lucide-react';
import { useAssistant } from '@/lib/assistant-context';
import { useCommandPalette } from '@/lib/command-palette-context';

export default function AssistantFAB() {
  const { toggle, open } = useAssistant();
  const { setOpen: setCmd } = useCommandPalette();

  if (open) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[70] flex flex-col gap-2">
      <button
        onClick={() => setCmd(true)}
        title="Command Palette (⌘K)"
        className="group flex items-center gap-2 h-9 pl-2 pr-3 rounded-full border border-border-hover bg-surface/95 backdrop-blur-md text-secondary hover:text-[#EAEAEF] hover:border-signal/30 transition-all"
      >
        <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border-subtle bg-elevated">⌘K</kbd>
        <span className="font-mono text-[11px]">Search anything</span>
      </button>
      <button
        onClick={toggle}
        title="Ask Wraith Intelligence (⌘J)"
        className="self-start group flex items-center gap-2 h-11 pl-3 pr-4 rounded-full border border-signal/30 bg-signal/5 text-signal hover:bg-signal/10 transition-all shadow-signal"
      >
        <span className="relative">
          <Sparkles size={14} />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
        </span>
        <span className="font-mono text-[12px] font-semibold">Ask Wraith</span>
      </button>
    </div>
  );
}
