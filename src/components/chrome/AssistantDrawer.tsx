'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Send, Trash2, Zap, TrendingUp, Shield, MessageSquare } from 'lucide-react';
import { useAssistant } from '@/lib/assistant-context';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
  { icon: Zap, label: 'Best signal right now', q: "What's the best signal right now?" },
  { icon: TrendingUp, label: "What's hot in sneakers", q: "What's hot in sneakers this week?" },
  { icon: Shield, label: 'Risk on my watchlist', q: 'Show me the risk on my watchlist' },
  { icon: MessageSquare, label: 'How does confidence work', q: 'How does Wraith calculate confidence?' },
];

function renderInline(content: string) {
  // simple bold rendering on **text**
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={i} className="text-[#EAEAEF] font-semibold">{p.slice(2, -2)}</strong>;
    }
    return <span key={i}>{p}</span>;
  });
}

export default function AssistantDrawer() {
  const { open, setOpen, messages, pending, send, clear, pendingPrefill, consumePrefill } = useAssistant();
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && pendingPrefill) {
      setDraft(pendingPrefill);
      setTimeout(() => {
        inputRef.current?.focus();
        if (pendingPrefill.length > 2) send(pendingPrefill);
        consumePrefill();
      }, 80);
    } else if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, pendingPrefill, send, consumePrefill]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pending]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    send(draft);
    setDraft('');
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[90] animate-fade-in"
          onClick={() => setOpen(false)}
          style={{ background: 'rgba(5,5,7,0.5)', backdropFilter: 'blur(4px)' }}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 right-0 bottom-0 w-full sm:max-w-md z-[91] bg-surface border-l border-border-hover flex flex-col transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{ boxShadow: open ? '-32px 0 64px rgba(0,0,0,0.5)' : undefined }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full border border-signal/40 bg-signal/5 flex items-center justify-center relative">
              <Sparkles size={13} className="text-signal" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-signal animate-pulse" />
            </div>
            <div>
              <p className="font-serif text-[15px] text-[#EAEAEF] leading-none">Wraith Intelligence</p>
              <p className="font-mono text-[9px] text-ghost mt-0.5">Online · 47,284 listings indexed</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={clear} title="Clear conversation" className="w-7 h-7 rounded border border-border-subtle bg-elevated text-ghost hover:text-warning flex items-center justify-center transition-colors">
              <Trash2 size={11} />
            </button>
            <button onClick={() => setOpen(false)} className="w-7 h-7 rounded border border-border-subtle bg-elevated text-ghost hover:text-[#EAEAEF] flex items-center justify-center transition-colors">
              <X size={11} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map(m => (
            <div key={m.id} className={cn('flex gap-2.5', m.role === 'user' && 'flex-row-reverse')}>
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border',
                  m.role === 'assistant'
                    ? 'border-signal/40 bg-signal/5 text-signal'
                    : 'border-blue/40 bg-blue/10 text-blue',
                )}
              >
                {m.role === 'assistant' ? <Sparkles size={10} /> : <span className="font-mono text-[9px]">V</span>}
              </div>
              <div className={cn('flex-1 max-w-[88%]', m.role === 'user' && 'text-right')}>
                <div
                  className={cn(
                    'inline-block px-3 py-2 rounded-lg text-[13px] leading-relaxed text-left',
                    m.role === 'assistant'
                      ? 'bg-elevated border border-border-subtle text-secondary'
                      : 'bg-blue/10 border border-blue/20 text-[#EAEAEF]',
                  )}
                >
                  {renderInline(m.content)}
                </div>
              </div>
            </div>
          ))}

          {pending && (
            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded-full border border-signal/40 bg-signal/5 flex items-center justify-center">
                <Sparkles size={10} className="text-signal" />
              </div>
              <div className="bg-elevated border border-border-subtle rounded-lg px-3 py-2.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" style={{ animationDelay: '200ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          )}

          {messages.length <= 1 && !pending && (
            <div className="pt-2">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ghost mb-2">Try asking…</p>
              <div className="grid grid-cols-1 gap-1.5">
                {SUGGESTIONS.map(s => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.q}
                      onClick={() => send(s.q)}
                      className="flex items-center gap-2 px-3 py-2 rounded border border-border-subtle bg-elevated/40 hover:border-signal/30 hover:bg-signal/5 text-left transition-colors group"
                    >
                      <Icon size={12} className="text-ghost group-hover:text-signal transition-colors" />
                      <span className="font-mono text-[12px] text-secondary group-hover:text-[#EAEAEF] transition-colors">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-border-subtle px-4 py-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask Wraith anything…"
              rows={1}
              className="flex-1 px-3 py-2 bg-elevated border border-border-subtle rounded font-mono text-[13px] text-[#EAEAEF] placeholder:text-ghost focus:border-signal/40 focus:outline-none resize-none max-h-32"
            />
            <button
              type="submit"
              disabled={!draft.trim() || pending}
              className="w-9 h-9 rounded border border-signal/40 bg-signal/10 text-signal flex items-center justify-center hover:bg-signal/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send size={13} />
            </button>
          </div>
          <p className="font-mono text-[9px] text-ghost mt-1.5">
            <kbd className="px-1 rounded border border-border-subtle">↵</kbd> send · <kbd className="px-1 rounded border border-border-subtle">⇧↵</kbd> newline · <kbd className="px-1 rounded border border-border-subtle">⌘J</kbd> toggle
          </p>
        </form>
      </aside>
    </>
  );
}
