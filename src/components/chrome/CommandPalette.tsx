'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Zap, Star, BarChart2, Calendar, Settings, Shield, MessageSquare, Sparkles,
  Eye, EyeOff, Volume2, VolumeX, Activity, Briefcase, ArrowRight, RefreshCw, LogOut, Compass, Wand2
} from 'lucide-react';
import { useCommandPalette } from '@/lib/command-palette-context';
import { useWraith } from '@/lib/wraith-context';
import { useAssistant } from '@/lib/assistant-context';
import { useActivity } from '@/lib/activity-context';
import { MOCK_SIGNALS } from '@/lib/mock-data';
import { cn, formatCurrency } from '@/lib/utils';

type CmdItem = {
  id: string;
  title: string;
  hint?: string;
  group: string;
  keywords?: string;
  icon: any;
  iconColor?: string;
  shortcut?: string;
  action: () => void;
  hidden?: boolean;
};

export default function CommandPalette() {
  const router = useRouter();
  const { open, setOpen, initialQuery } = useCommandPalette();
  const { isAdmin, viewMode, toggleViewMode, demoMode, toggleDemoMode, soundEnabled, toggleSound, liveMode, toggleLiveMode, signOut, resetTour } = useWraith();
  const { prefill } = useAssistant();
  const { push } = useActivity();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery(initialQuery || '');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open, initialQuery]);

  const close = () => setOpen(false);

  const items: CmdItem[] = useMemo(() => {
    const nav: CmdItem[] = [
      { id: 'go-signals', title: 'Go to Signals', group: 'Navigate', icon: Zap, iconColor: '#00FF88', shortcut: 'G S', action: () => { router.push('/dashboard'); close(); } },
      { id: 'go-watchlist', title: 'Go to Watchlist', group: 'Navigate', icon: Star, iconColor: '#FFB800', shortcut: 'G W', action: () => { router.push('/dashboard/watchlist'); close(); } },
      { id: 'go-portfolio', title: 'Go to Portfolio', group: 'Navigate', icon: Briefcase, iconColor: '#4D7CFF', shortcut: 'G P', action: () => { router.push('/dashboard/portfolio'); close(); } },
      { id: 'go-analytics', title: 'Go to Analytics', group: 'Navigate', icon: BarChart2, iconColor: '#4D7CFF', shortcut: 'G A', action: () => { router.push('/dashboard/analytics'); close(); } },
      { id: 'go-drops', title: 'Go to Drops', group: 'Navigate', icon: Calendar, iconColor: '#FF3D57', shortcut: 'G D', action: () => { router.push('/dashboard/drops'); close(); } },
      { id: 'go-settings', title: 'Go to Settings', group: 'Navigate', icon: Settings, shortcut: 'G ,', action: () => { router.push('/dashboard/settings'); close(); } },
      { id: 'go-admin', title: 'Go to Admin Console', group: 'Navigate', icon: Shield, iconColor: '#FF3D57', shortcut: 'G X', action: () => { router.push('/dashboard/admin'); close(); }, hidden: !isAdmin },
    ];

    const ai: CmdItem[] = [
      { id: 'ai-best', title: 'Ask Wraith: What\'s the best signal right now?', group: 'AI', icon: Sparkles, iconColor: '#00FF88', action: () => { prefill('What\'s the best signal right now?'); close(); } },
      { id: 'ai-market', title: 'Ask Wraith: What\'s the market doing today?', group: 'AI', icon: Sparkles, iconColor: '#00FF88', action: () => { prefill('What\'s the market doing today?'); close(); } },
      { id: 'ai-risk', title: 'Ask Wraith: Show me the risk on my watchlist', group: 'AI', icon: Sparkles, iconColor: '#00FF88', action: () => { prefill('Show me the risk on my watchlist'); close(); } },
      { id: 'ai-open', title: 'Open Wraith Intelligence chat', group: 'AI', icon: MessageSquare, iconColor: '#00FF88', shortcut: '⌘J', action: () => { prefill(''); close(); } },
    ];

    const settings: CmdItem[] = [
      { id: 'toggle-view', title: viewMode === 'admin' ? 'Switch to User view' : 'Switch to Admin view', group: 'Mode', icon: Shield, iconColor: '#FF3D57', action: () => { toggleViewMode(); push({ kind: 'system', title: `Switched to ${viewMode === 'admin' ? 'User' : 'Admin'} view` }); close(); }, hidden: !isAdmin },
      { id: 'toggle-demo', title: demoMode ? 'Turn OFF Demo Mode' : 'Turn ON Demo Mode (sample data)', group: 'Mode', icon: demoMode ? EyeOff : Eye, iconColor: '#FFB800', action: () => { toggleDemoMode(); push({ kind: 'system', title: `Demo mode ${demoMode ? 'disabled' : 'enabled'}` }); close(); }, hidden: !isAdmin },
      { id: 'toggle-live', title: liveMode ? 'Pause Live Signals' : 'Resume Live Signals', group: 'Mode', icon: liveMode ? Activity : RefreshCw, iconColor: '#00FF88', action: () => { toggleLiveMode(); close(); } },
      { id: 'toggle-sound', title: soundEnabled ? 'Mute notification sounds' : 'Enable notification sounds', group: 'Mode', icon: soundEnabled ? VolumeX : Volume2, action: () => { toggleSound(); close(); } },
      { id: 'tour', title: 'Replay onboarding tour', group: 'Mode', icon: Compass, action: () => { resetTour(); router.push('/dashboard'); close(); } },
      { id: 'money-mode', title: 'Activate Money Mode 💸', group: 'Mode', icon: Wand2, iconColor: '#FFB800', keywords: 'money rain easter egg', action: () => {
        window.dispatchEvent(new CustomEvent('wraith:money-mode'));
        close();
      } },
      { id: 'sign-out', title: 'Sign out', group: 'Account', icon: LogOut, action: () => { signOut(); router.push('/'); close(); } },
    ];

    const signals: CmdItem[] = MOCK_SIGNALS.slice(0, 18).map(s => ({
      id: `sig-${s.id}`,
      title: s.itemName,
      hint: `${formatCurrency(s.profit)} profit · ${s.confidence}% conf · ${s.buyPlatform} → ${s.sellPlatform}`,
      group: 'Signals',
      icon: Zap,
      iconColor: s.confidence >= 90 ? '#00FF88' : '#6B6B7B',
      keywords: `${s.brand} ${s.category} ${s.buyPlatform} ${s.sellPlatform}`,
      action: () => { router.push(`/dashboard/signal/${s.id}`); close(); },
    }));

    return [...nav, ...ai, ...settings, ...signals].filter(i => !i.hidden);
  }, [router, isAdmin, viewMode, demoMode, soundEnabled, liveMode, prefill, push, toggleViewMode, toggleDemoMode, toggleSound, toggleLiveMode, signOut, resetTour]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.group.toLowerCase().includes(q) ||
      i.keywords?.toLowerCase().includes(q),
    );
  }, [items, query]);

  const grouped = useMemo(() => {
    const groups: Record<string, CmdItem[]> = {};
    filtered.forEach(i => {
      if (!groups[i.group]) groups[i.group] = [];
      groups[i.group].push(i);
    });
    const order = ['Navigate', 'AI', 'Mode', 'Account', 'Signals'];
    return order.filter(g => groups[g]?.length).map(g => ({ name: g, items: groups[g] }));
  }, [filtered]);

  const flat = useMemo(() => grouped.flatMap(g => g.items), [grouped]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(flat.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(0, i - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        flat[selectedIndex]?.action();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, flat, selectedIndex]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4 animate-fade-in"
      onClick={close}
      style={{ background: 'rgba(5,5,7,0.6)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-border-hover bg-surface shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,136,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
          <Search size={14} className="text-ghost" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search signals, navigate, ask Wraith…"
            className="flex-1 bg-transparent font-mono text-[13px] text-[#EAEAEF] placeholder:text-ghost focus:outline-none"
          />
          <kbd className="font-mono text-[10px] text-ghost px-1.5 py-0.5 rounded border border-border-subtle">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {grouped.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="font-mono text-[12px] text-ghost mb-1">No matches</p>
              <p className="font-mono text-[11px] text-ghost">Try a different query, or ask Wraith Intelligence.</p>
              <button
                onClick={() => { prefill(query); close(); }}
                className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] text-signal hover:underline"
              >
                <Sparkles size={11} /> Ask Wraith: "{query}"
              </button>
            </div>
          ) : (
            grouped.map(group => (
              <div key={group.name} className="px-2 mb-1">
                <p className="px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-ghost">{group.name}</p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const idx = flat.indexOf(item);
                  const active = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded transition-colors text-left',
                        active ? 'bg-elevated' : 'hover:bg-elevated/60',
                      )}
                    >
                      <Icon size={13} style={{ color: item.iconColor || '#6B6B7B' }} className="flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[12px] text-[#EAEAEF] truncate">{item.title}</p>
                        {item.hint && <p className="font-mono text-[10px] text-ghost truncate">{item.hint}</p>}
                      </div>
                      {item.shortcut && (
                        <kbd className="font-mono text-[9px] text-ghost px-1.5 py-0.5 rounded border border-border-subtle whitespace-nowrap">{item.shortcut}</kbd>
                      )}
                      {active && <ArrowRight size={11} className="text-signal flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border-subtle flex items-center justify-between bg-void/40">
          <div className="flex items-center gap-3 font-mono text-[10px] text-ghost">
            <span><kbd className="px-1 py-0.5 rounded border border-border-subtle">↑↓</kbd> navigate</span>
            <span><kbd className="px-1 py-0.5 rounded border border-border-subtle">↵</kbd> select</span>
            <span><kbd className="px-1 py-0.5 rounded border border-border-subtle">esc</kbd> close</span>
          </div>
          {isAdmin && (
            <span className="font-mono text-[9px] text-signal/60">ADMIN · {viewMode.toUpperCase()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
