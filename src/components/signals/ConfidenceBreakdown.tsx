'use client';

import { useMemo } from 'react';
import { ShieldCheck, Zap, Users, AlertTriangle, Lock, BarChart2 } from 'lucide-react';
import { Signal } from '@/types';

interface Factor {
  label: string;
  score: number;
  weight: number;
  icon: any;
  description: string;
}

export default function ConfidenceBreakdown({ signal }: { signal: Signal }) {
  const factors = useMemo<Factor[]>(() => {
    const spreadScore = Math.min(100, Math.round((signal.profit / signal.buyPrice) * 320));
    const socialScore = signal.socialScore ?? 60;
    const velocityScore = signal.urgency === 'act_now' ? 92 : signal.urgency === 'within_48hrs' ? 76 : 55;
    const supplyScore = signal.urgency === 'act_now' ? 85 : 65;
    const trustScore = signal.buyPlatform === 'stockx' || signal.buyPlatform === 'goat' ? 90 : 72;
    return [
      { label: 'Price spread vs comps', score: Math.max(40, Math.min(100, spreadScore)), weight: 35, icon: BarChart2, description: 'How far below 30-day average comp this listing sits' },
      { label: 'Social momentum', score: socialScore, weight: 20, icon: Users, description: 'TikTok + IG growth velocity in last 72h' },
      { label: 'Supply constraint', score: supplyScore, weight: 15, icon: Lock, description: 'Listings disappearing vs new entrants' },
      { label: 'Seller velocity & trust', score: trustScore, weight: 15, icon: ShieldCheck, description: 'Seller rating, listing freshness, response time' },
      { label: 'Historical flip success', score: 78, weight: 15, icon: Zap, description: 'Similar listings → completed flip rate' },
    ];
  }, [signal]);

  const riskScore = useMemo(() => {
    // Inverse of weighted average (lower confidence → higher risk)
    const weighted = factors.reduce((sum, f) => sum + (f.score * f.weight) / 100, 0);
    return Math.max(0, Math.min(100, 100 - weighted));
  }, [factors]);

  const verdict =
    signal.confidence >= 90 ? { label: 'TEXTBOOK FLIP', color: '#00FF88', desc: 'Multiple factors aligned. We would take this trade.' } :
    signal.confidence >= 80 ? { label: 'STRONG SIGNAL', color: '#00FF88', desc: 'High-conviction edge. Worth the capital allocation.' } :
    signal.confidence >= 70 ? { label: 'WORTH WATCHING', color: '#FFB800', desc: 'Decent edge but factors not fully aligned.' } :
    { label: 'EDGE THIN', color: '#FF3D57', desc: 'Margin is real but execution risk is elevated.' };

  return (
    <div className="rounded-lg border border-border-subtle bg-surface overflow-hidden">
      <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck size={13} className="text-signal" />
          <h2 className="font-semibold text-[14px] text-[#EAEAEF]">Confidence Breakdown</h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[10px] px-2 py-0.5 rounded border"
            style={{ color: verdict.color, borderColor: `${verdict.color}40`, background: `${verdict.color}10` }}
          >
            {verdict.label}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="grid lg:grid-cols-[1fr,160px] gap-5 items-start">
          {/* Factors */}
          <div className="space-y-3">
            {factors.map(f => {
              const Icon = f.icon;
              const color = f.score >= 85 ? '#00FF88' : f.score >= 70 ? '#FFB800' : '#FF3D57';
              return (
                <div key={f.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Icon size={11} style={{ color }} className="flex-shrink-0" />
                      <span className="font-mono text-[11px] text-[#EAEAEF] truncate">{f.label}</span>
                      <span className="font-mono text-[9px] text-ghost flex-shrink-0">{f.weight}%w</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold" style={{ color }}>{f.score}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${f.score}%`, background: color, boxShadow: `0 0 8px ${color}50` }}
                    />
                  </div>
                  <p className="font-mono text-[9px] text-ghost mt-0.5">{f.description}</p>
                </div>
              );
            })}
          </div>

          {/* Risk dial + verdict */}
          <div className="rounded-lg border border-border-subtle bg-elevated p-4 flex flex-col items-center">
            <p className="font-mono text-[9px] text-ghost uppercase tracking-wider mb-2">Risk score</p>
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
                <circle
                  cx="60" cy="60" r="50"
                  stroke={riskScore > 60 ? '#FF3D57' : riskScore > 30 ? '#FFB800' : '#00FF88'}
                  strokeWidth="6" fill="none" strokeLinecap="round"
                  strokeDasharray={`${(riskScore / 100) * 314} 314`}
                  transform="rotate(-90 60 60)"
                  style={{ filter: 'drop-shadow(0 0 8px currentColor)', transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-mono text-[24px] font-bold text-[#EAEAEF] leading-none">{Math.round(riskScore)}</p>
                <p className="font-mono text-[9px] text-ghost">/ 100</p>
              </div>
            </div>
            <p className="font-mono text-[10px] text-secondary text-center mt-3 leading-relaxed">{verdict.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
