'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react';

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  at: number;
}

interface AssistantContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  messages: AssistantMessage[];
  pending: boolean;
  send: (text: string) => void;
  clear: () => void;
  prefill: (text: string) => void;
  pendingPrefill: string;
  consumePrefill: () => void;
}

const AssistantContext = createContext<AssistantContextValue | null>(null);

const SEED_RESPONSES: { match: RegExp; reply: (q: string) => string }[] = [
  {
    match: /best (signal|flip|deal)|top (signal|pick)/i,
    reply: () =>
      "Top pick right now: **Jordan 4 Bred Reimagined** — 94% confidence. Mercari listing at $198, StockX last sale $267 net $41 profit after fees. Window is tight, ~4–6 hours typical sell-through at this price. Social volume +340% this week. Pull the trigger.",
  },
  {
    match: /should i (buy|cop|pick up|flip)/i,
    reply: () =>
      "Three filters first: (1) is confidence ≥85? (2) is profit margin ≥18% after fees? (3) is there active social momentum or supply constraint? If yes to all three, you have a textbook flip. The current best match in your feed is the **Supreme FW24 Box Logo** — 91% confidence, 28% ROI, 18.7K TikTok mentions. Move fast.",
  },
  {
    match: /(why|how) (does|is) (wraith|confidence)/i,
    reply: () =>
      "Wraith's confidence score weights five factors: price spread vs. 30-day comp average (35%), seller velocity & trust (15%), social momentum acceleration (20%), supply constraint signals (15%), and historical flip success on similar listings (15%). Anything above 85% has cleared every filter at least twice.",
  },
  {
    match: /(sneakers?|jordan|nike|yeezy|dunk)/i,
    reply: () =>
      "Sneaker bench right now: 14 active arbitrage signals. Strongest cluster is Jordan 4 Bred Reimagined + SB Dunk Paris — both have rising momentum and seller-side underpricing on Mercari/eBay vs. StockX. New Balance 2002R Protection Pack is the dark horse: low hype, sticky demand, 22% spread.",
  },
  {
    match: /(streetwear|supreme|hoodie|tee)/i,
    reply: () =>
      "Streetwear: Supreme Box Logo FW24 leads with 28% ROI on the Grailed → StockX route. Watch for the next BAPE x camo restock — supply constraint forming. Tip: Grailed sellers accept offers 12–18% below ask 64% of the time, especially within 36h of listing.",
  },
  {
    match: /(cards?|pokemon|charizard|tcg)/i,
    reply: () =>
      "TCG side: PSA 10 Charizard 1st Edition holding a 14% spread between Mercari raw cards and post-grade comp. If you have grading bandwidth, this is the move. Modern Crown Zenith Mew V Alt Art is the sleeper — TikTok mentions up 280% in 72h.",
  },
  {
    match: /(market|trend|momentum|hot)/i,
    reply: () =>
      "Market read: Sneakers softening but still positive (+3.2% wk). Streetwear flat. TCG up sharply (+11% wk on Pokémon, +6% on Magic). Vintage Y2K denim is the breakout category — eBay underpricing is severe. Park 20% of your capital there for the next 2 weeks.",
  },
  {
    match: /(risk|safe|dangerous|hold)/i,
    reply: () =>
      "Risk view across your active signals: Average confidence 82%, expected drawdown 6%. Two outliers worth watching — the Yeezy 350 V2 Bone signal is leveraged on Kanye news cycle (volatile) and the Travis Scott AJ1 Low has authentication risk on eBay route. Stay within StockX/GOAT for those.",
  },
  {
    match: /(scan|refresh|update|status)/i,
    reply: () =>
      "Last scan completed 47 seconds ago across 47,284 listings on 5 platforms. 12 new candidates evaluated, 3 promoted to signals, 1 dismissed for low confidence. Next scheduled scan in 12s. Press R on the dashboard to force a manual refresh.",
  },
  {
    match: /(help|what (can you|do you))/i,
    reply: () =>
      "I'm Wraith Intelligence — I can analyze any signal, explain confidence factors, surface market trends, recommend allocation, simulate flips, and answer 'should I buy this'. Try: \"best signal right now\", \"why is confidence high on Jordan 4\", \"what's the market doing today\", or paste any item name.",
  },
];

function generateReply(q: string): string {
  for (const r of SEED_RESPONSES) {
    if (r.match.test(q)) return r.reply(q);
  }
  // Fallback intelligent response
  const fragments = [
    `Reading the room on "${q.slice(0, 60)}"…`,
    "Cross-referencing live spread data on StockX, GOAT, eBay, Mercari, and Grailed.",
    "Best adjacent signal: the **Jordan 4 Bred Reimagined** Mercari→StockX play — 94% confidence, $41 net.",
    "Tell me what dimension matters most (profit, speed, confidence, ROI %) and I'll narrow it down.",
  ];
  return fragments.join(' ');
}

let mid = 0;
function nextId() {
  mid += 1;
  return `m_${Date.now()}_${mid}`;
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'seed',
      role: 'assistant',
      content:
        "I'm **Wraith Intelligence** — your live arbitrage co-pilot. I see every signal, every spread, every TikTok spike across 5 platforms. Ask me anything: 'what's the best flip right now?', 'should I buy the Travis Scotts?', 'what's trending in streetwear?'",
      at: Date.now(),
    },
  ]);
  const [pending, setPending] = useState(false);
  const [pendingPrefill, setPendingPrefill] = useState('');
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = useCallback(() => setOpen(o => !o), []);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: AssistantMessage = { id: nextId(), role: 'user', content: trimmed, at: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setPending(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      const reply: AssistantMessage = { id: nextId(), role: 'assistant', content: generateReply(trimmed), at: Date.now() };
      setMessages(prev => [...prev, reply]);
      setPending(false);
    }, 700 + Math.random() * 700);
  }, []);

  const clear = useCallback(() => {
    setMessages([
      {
        id: 'seed',
        role: 'assistant',
        content: "Cleared. What do you want to know?",
        at: Date.now(),
      },
    ]);
  }, []);

  const prefill = useCallback((text: string) => {
    setPendingPrefill(text);
    setOpen(true);
  }, []);

  const consumePrefill = useCallback(() => setPendingPrefill(''), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const inField = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;
      if (!inField && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setOpen(o => !o);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <AssistantContext.Provider value={{ open, setOpen, toggle, messages, pending, send, clear, prefill, pendingPrefill, consumePrefill }}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error('useAssistant must be used within AssistantProvider');
  return ctx;
}
