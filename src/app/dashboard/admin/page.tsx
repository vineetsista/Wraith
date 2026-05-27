'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RefreshCw, Users, Activity, Zap, BarChart2, Shield, Eye, EyeOff, ArrowLeftRight,
  Volume2, VolumeX, Pause, Play, Server, Cpu, Globe,
  Search, Flag, Sparkles, Lock, Heart,
} from 'lucide-react';
import { useWraith, ADMIN_EMAIL } from '@/lib/wraith-context';
import { useActivity } from '@/lib/activity-context';
import { MOCK_SIGNALS } from '@/lib/mock-data';
import { cn, timeAgo } from '@/lib/utils';
import { useAnimateNumber } from '@/hooks/useAnimateNumber';

const MOCK_USERS = [
  { id: '1', email: 'reseller@nyc.com', name: 'Jordan F.', status: 'active', plan: 'pro', signalsViewed: 340, flips: 12, joined: '2024-11-01' },
  { id: '2', email: 'kicks@grail.io', name: 'Marcus T.', status: 'active', plan: 'pro', signalsViewed: 218, flips: 8, joined: '2024-11-14' },
  { id: '3', email: 'tcg@collector.me', name: 'Sarah K.', status: 'trialing', plan: 'trial', signalsViewed: 94, flips: 3, joined: '2024-12-01' },
  { id: '4', email: 'streetwear@fw.com', name: 'Dev P.', status: 'active', plan: 'pro', signalsViewed: 187, flips: 6, joined: '2024-10-20' },
  { id: '5', email: 'flip@resale.co', name: 'Emma W.', status: 'canceled', plan: 'none', signalsViewed: 45, flips: 1, joined: '2024-09-15' },
  { id: '6', email: 'vineet.sista@gmail.com', name: 'Vineet Sista', status: 'active', plan: 'admin', signalsViewed: 1284, flips: 47, joined: '2024-09-12' },
];

const PLATFORM_HEALTH = [
  { name: 'StockX', status: 'green', latency: 187, scans: 12480, errors: 0 },
  { name: 'GOAT', status: 'green', latency: 220, scans: 9870, errors: 2 },
  { name: 'eBay', status: 'yellow', latency: 480, scans: 18400, errors: 11 },
  { name: 'Mercari', status: 'green', latency: 165, scans: 4280, errors: 0 },
  { name: 'Grailed', status: 'green', latency: 198, scans: 2254, errors: 1 },
];

const FEATURE_FLAGS_INITIAL = [
  { id: 'live-stream', label: 'Live Signal Stream', desc: 'Real-time signal arrival in dashboard', enabled: true },
  { id: 'ai-assistant', label: 'Wraith Intelligence', desc: 'AI co-pilot drawer (⌘J)', enabled: true },
  { id: 'social-momentum', label: 'Social Momentum scoring', desc: 'Weight TikTok + IG into confidence', enabled: true },
  { id: 'drops-prediction', label: 'Drop predictions', desc: 'AI resale price forecasts for upcoming drops', enabled: true },
  { id: 'portfolio-sync', label: 'Portfolio auto-sync', desc: 'Pull StockX/GOAT sale history', enabled: false },
  { id: 'discord-alerts', label: 'Discord webhooks', desc: 'Push signals to user-configured Discord', enabled: true },
];

export default function AdminPage() {
  const router = useRouter();
  const { isAdmin, user, viewMode, toggleViewMode, demoMode, toggleDemoMode, soundEnabled, toggleSound, liveMode, toggleLiveMode } = useWraith();
  const { push } = useActivity();
  const [scanning, setScanning] = useState(false);
  const [flags, setFlags] = useState(FEATURE_FLAGS_INITIAL);
  const [auditLog, setAuditLog] = useState<{ id: string; at: number; actor: string; action: string; target?: string }[]>([
    { id: 'a1', at: Date.now() - 1000 * 60 * 3, actor: 'system', action: 'Scan cycle complete', target: '47,284 listings · 12 candidates · 3 promoted' },
    { id: 'a2', at: Date.now() - 1000 * 60 * 11, actor: 'system', action: 'Confidence model recalibrated', target: 'v3.4 weights deployed' },
    { id: 'a3', at: Date.now() - 1000 * 60 * 24, actor: 'admin', action: 'Suspended user', target: 'flip@resale.co (payment dispute)' },
    { id: 'a4', at: Date.now() - 1000 * 60 * 47, actor: 'system', action: 'New signal generated', target: 'Jordan 4 Bred Reimagined (94% conf)' },
  ]);

  const totalUsers = useAnimateNumber(1284, 600);
  const githubStars = useAnimateNumber(842, 1000);
  const totalSignals = useAnimateNumber(42800, 900);
  const scanRate = useAnimateNumber(47284, 1200);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-xl border border-warning/30 bg-warning/5 p-8 text-center">
          <Lock size={28} className="text-warning mx-auto mb-3" />
          <h1 className="font-serif text-[22px] text-[#EAEAEF] mb-2">Admin access required</h1>
          <p className="font-mono text-[12px] text-secondary mb-1">This console is restricted.</p>
          <p className="font-mono text-[10px] text-ghost">Sign in as {ADMIN_EMAIL} to continue.</p>
        </div>
      </div>
    );
  }

  function logAudit(action: string, target?: string) {
    setAuditLog(prev => [{ id: `a_${Date.now()}`, at: Date.now(), actor: user?.name || 'admin', action, target }, ...prev].slice(0, 30));
  }

  async function triggerScan() {
    setScanning(true);
    logAudit('Manual scan triggered', 'all platforms');
    push({ kind: 'admin', title: 'Manual scan initiated', body: 'Sweeping 5 platforms · ETA 2.4s' });
    await new Promise(r => setTimeout(r, 2500));
    const found = Math.floor(Math.random() * 4) + 2;
    push({ kind: 'signal_new', title: `Scan complete · ${found} new signals`, body: 'Promoted to user feeds' });
    logAudit('Scan complete', `${found} signals promoted`);
    setScanning(false);
  }

  function toggleFlag(id: string) {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
    const flag = flags.find(f => f.id === id);
    if (flag) logAudit(`Feature flag ${flag.enabled ? 'disabled' : 'enabled'}`, flag.label);
  }

  return (
    <div className="min-h-screen bg-void">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={16} className="text-warning" />
              <h1 className="font-serif text-[28px] text-[#EAEAEF] leading-none">Admin Console</h1>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-warning/30 bg-warning/10 text-warning">RESTRICTED</span>
            </div>
            <p className="font-mono text-[12px] text-ghost">Platform intelligence · user management · system controls</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => { toggleViewMode(); push({ kind: 'admin', title: `Switched to ${viewMode === 'admin' ? 'User' : 'Admin'} view` }); }}
              className="h-9 px-4 rounded border border-warning/30 bg-warning/5 text-warning font-mono text-[12px] flex items-center gap-1.5 hover:bg-warning/10 transition-all"
            >
              <ArrowLeftRight size={11} />
              View as {viewMode === 'admin' ? 'User' : 'Admin'}
            </button>
            <button
              onClick={triggerScan}
              disabled={scanning}
              className="h-9 px-5 rounded border border-signal/30 bg-signal/5 font-mono text-[12px] text-signal hover:bg-signal/10 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              <RefreshCw size={12} className={scanning ? 'animate-spin' : ''} />
              {scanning ? 'Scanning...' : 'Trigger Scan'}
            </button>
          </div>
        </div>

        {/* Demo Mode + System Toggles bar */}
        <div className="rounded-lg border border-warning/20 bg-warning/5 p-4 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <Sparkles size={14} className="text-warning mt-0.5" />
            <div className="flex-1">
              <p className="font-mono text-[12px] font-semibold text-[#EAEAEF] mb-0.5">Demo &amp; presentation controls</p>
              <p className="font-mono text-[11px] text-secondary">Toggle sample data, mute notifications, freeze the live stream — only visible to admins. The user view never sees these controls.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <ToggleTile
              icon={demoMode ? Eye : EyeOff}
              label="Demo Data"
              hint={demoMode ? 'Sample portfolio + flips visible' : 'Real (empty) state'}
              on={demoMode}
              onChange={() => { toggleDemoMode(); logAudit(`Demo mode ${demoMode ? 'OFF' : 'ON'}`); }}
              tone="gold"
            />
            <ToggleTile
              icon={liveMode ? Pause : Play}
              label="Live Signal Stream"
              hint={liveMode ? 'New signals arriving every 15–45s' : 'Stream paused'}
              on={liveMode}
              onChange={() => { toggleLiveMode(); logAudit(`Live stream ${liveMode ? 'PAUSED' : 'RESUMED'}`); }}
              tone="signal"
            />
            <ToggleTile
              icon={soundEnabled ? Volume2 : VolumeX}
              label="Notification Sounds"
              hint={soundEnabled ? 'Soft pings on new signals' : 'Muted'}
              on={soundEnabled}
              onChange={() => { toggleSound(); logAudit(`Sound ${soundEnabled ? 'MUTED' : 'ENABLED'}`); }}
              tone="blue"
            />
            <ToggleTile
              icon={Shield}
              label={`Currently viewing: ${viewMode.toUpperCase()}`}
              hint={viewMode === 'admin' ? 'Full controls visible' : 'Seeing user-facing surface'}
              on={viewMode === 'admin'}
              onChange={() => toggleViewMode()}
              tone="warning"
            />
          </div>
        </div>

        {/* Platform stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { icon: Users, label: 'Total Users', value: totalUsers.toLocaleString(), sub: '1,247 active · +42 today', color: '#4D7CFF' },
            { icon: Heart, label: 'GitHub Stars', value: githubStars.toLocaleString(), sub: '+118 this week · open source', color: '#FFB800' },
            { icon: Activity, label: 'Signals Generated', value: totalSignals.toLocaleString(), sub: `${MOCK_SIGNALS.filter(s => s.isActive).length} active right now`, color: '#00FF88' },
            { icon: Search, label: 'Listings Scanned', value: scanRate.toLocaleString(), sub: 'last 30 minutes', color: '#FF3D57' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-lg border border-border-subtle bg-surface p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={12} style={{ color: stat.color }} />
                  <span className="font-mono text-[9px] text-ghost uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="font-mono text-[22px] font-bold text-[#EAEAEF] leading-none mb-1">{stat.value}</p>
                <p className="font-mono text-[10px] text-secondary">{stat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* System Health + Activity */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 rounded-lg border border-border-subtle bg-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Server size={13} className="text-signal" />
                <h2 className="font-semibold text-[14px] text-[#EAEAEF]">Platform Health</h2>
              </div>
              <span className="font-mono text-[10px] text-ghost">last 30 minutes</span>
            </div>
            <div className="space-y-2">
              {PLATFORM_HEALTH.map(p => {
                const color = p.status === 'green' ? '#00FF88' : p.status === 'yellow' ? '#FFB800' : '#FF3D57';
                return (
                  <div key={p.name} className="flex items-center justify-between gap-2 p-2.5 rounded border border-border-subtle bg-elevated">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                      <span className="font-mono text-[12px] text-[#EAEAEF]">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono text-[10px] text-ghost flex-shrink-0">
                      <span><span className="text-secondary">{p.latency}ms</span> latency</span>
                      <span><span className="text-secondary">{p.scans.toLocaleString()}</span> scans</span>
                      <span style={{ color: p.errors > 5 ? '#FF3D57' : p.errors > 0 ? '#FFB800' : '#3A3A48' }}>{p.errors} errors</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-border-subtle bg-surface p-5">
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={13} className="text-signal" />
              <h2 className="font-semibold text-[14px] text-[#EAEAEF]">System</h2>
            </div>
            <div className="space-y-2.5">
              <SysStat label="API uptime (30d)" value="99.97%" color="#00FF88" />
              <SysStat label="DB connections" value="124 / 200" color="#00FF88" />
              <SysStat label="Confidence model" value="v3.4" color="#EAEAEF" />
              <SysStat label="Avg signal latency" value="427ms" color="#00FF88" />
              <SysStat label="Discord webhooks" value="1,084 active" color="#EAEAEF" />
              <SysStat label="Rate-limit incidents" value="3 (eBay)" color="#FFB800" />
            </div>
          </div>
        </div>

        {/* Feature flags + Audit log */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border border-border-subtle bg-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flag size={13} className="text-blue" />
                <h2 className="font-semibold text-[14px] text-[#EAEAEF]">Feature Flags</h2>
              </div>
              <span className="font-mono text-[10px] text-ghost">{flags.filter(f => f.enabled).length}/{flags.length} on</span>
            </div>
            <div className="space-y-2">
              {flags.map(f => (
                <div key={f.id} className="flex items-center justify-between gap-3 p-2.5 rounded border border-border-subtle bg-elevated">
                  <div className="min-w-0">
                    <p className="font-mono text-[12px] text-[#EAEAEF] truncate">{f.label}</p>
                    <p className="font-mono text-[10px] text-ghost truncate">{f.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleFlag(f.id)}
                    className={cn('relative h-5 w-9 rounded-full transition-colors flex-shrink-0', f.enabled ? 'bg-signal/30' : 'bg-elevated border border-border-hover')}
                  >
                    <span
                      className={cn('absolute top-0.5 w-4 h-4 rounded-full transition-all', f.enabled ? 'left-[18px] bg-signal' : 'left-0.5 bg-ghost')}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border-subtle bg-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity size={13} className="text-gold" />
                <h2 className="font-semibold text-[14px] text-[#EAEAEF]">Audit Log</h2>
              </div>
              <span className="font-mono text-[10px] text-ghost">{auditLog.length} events</span>
            </div>
            <div className="space-y-1.5 max-h-[320px] overflow-y-auto">
              {auditLog.map(e => (
                <div key={e.id} className="flex items-start gap-2 p-2 rounded border border-border-subtle bg-elevated">
                  <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', e.actor === 'system' ? 'bg-blue' : 'bg-warning')} />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[11px] text-[#EAEAEF]"><span className="text-ghost mr-1.5">{e.actor}</span>{e.action}</p>
                    {e.target && <p className="font-mono text-[10px] text-ghost truncate">{e.target}</p>}
                  </div>
                  <span className="font-mono text-[9px] text-ghost flex-shrink-0 whitespace-nowrap">{timeAgo(new Date(e.at))}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border border-border-subtle bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart2 size={13} className="text-ghost" />
                <span className="font-mono text-[12px] text-secondary">Signals per day (7d)</span>
              </div>
              <span className="font-mono text-[10px] text-signal">+18% vs prev</span>
            </div>
            <div className="flex items-end gap-1 h-24">
              {[62, 78, 54, 91, 88, 103, 95].map((v, i) => (
                <div key={i} className="flex-1 rounded-sm bg-signal/20 hover:bg-signal/40 transition-colors" style={{ height: `${(v / 110) * 100}%` }} />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border-subtle bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users size={13} className="text-ghost" />
                <span className="font-mono text-[12px] text-secondary">New signups (7d)</span>
              </div>
              <span className="font-mono text-[10px] text-signal">+24% vs prev</span>
            </div>
            <div className="flex items-end gap-1 h-24">
              {[14, 22, 18, 31, 27, 35, 29].map((v, i) => (
                <div key={i} className="flex-1 rounded-sm bg-blue/20 hover:bg-blue/40 transition-colors" style={{ height: `${(v / 40) * 100}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* User management table */}
        <div className="rounded-lg border border-border-subtle bg-surface overflow-hidden">
          <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[14px] text-[#EAEAEF]">Recent Users</h2>
              <p className="font-mono text-[10px] text-ghost">{MOCK_USERS.length} accounts shown · {MOCK_USERS.filter(u => u.status === 'active').length} active</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Search users…" className="h-8 px-3 bg-elevated border border-border-subtle rounded font-mono text-[11px] text-[#EAEAEF] placeholder:text-ghost focus:border-border-hover focus:outline-none" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  {['User', 'Status', 'Plan', 'Signals', 'Flips', 'Joined', 'Actions'].map(col => (
                    <th key={col} className="px-4 py-3 text-left font-mono text-[10px] text-ghost uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map(u => {
                  const isAdminUser = u.email === ADMIN_EMAIL;
                  return (
                    <tr key={u.id} className={cn('border-b border-border-subtle last:border-0 hover:bg-elevated transition-colors', isAdminUser && 'bg-warning/5')}>
                      <td className="px-4 py-3">
                        <p className="font-mono text-[12px] text-[#EAEAEF] flex items-center gap-1.5">
                          {u.name}
                          {isAdminUser && <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-warning/30 bg-warning/10 text-warning">YOU</span>}
                        </p>
                        <p className="font-mono text-[10px] text-ghost">{u.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded border"
                          style={{
                            color: u.status === 'active' ? '#00FF88' : u.status === 'trialing' ? '#FFB800' : '#FF3D57',
                            background: u.status === 'active' ? 'rgba(0,255,136,0.08)' : u.status === 'trialing' ? 'rgba(255,184,0,0.08)' : 'rgba(255,61,87,0.08)',
                            borderColor: u.status === 'active' ? 'rgba(0,255,136,0.25)' : u.status === 'trialing' ? 'rgba(255,184,0,0.25)' : 'rgba(255,61,87,0.25)',
                          }}
                        >
                          {u.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px] text-secondary capitalize">{u.plan}</td>
                      <td className="px-4 py-3 font-mono text-[12px] text-secondary">{u.signalsViewed}</td>
                      <td className="px-4 py-3 font-mono text-[12px] text-signal">{u.flips}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-ghost">{u.joined}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            disabled={isAdminUser}
                            onClick={() => { logAudit('Impersonation started', u.email); push({ kind: 'admin', title: `Now viewing as ${u.name}`, body: 'Session ends in 15 min · audit-logged' }); }}
                            className="font-mono text-[10px] px-2 py-1 rounded border border-border-subtle text-ghost hover:text-[#EAEAEF] hover:border-border-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Impersonate
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleTile({ icon: Icon, label, hint, on, onChange, tone }: {
  icon: any; label: string; hint: string; on: boolean; onChange: () => void; tone: 'gold' | 'signal' | 'blue' | 'warning';
}) {
  const colors = {
    gold: { fg: '#FFB800', border: 'border-gold/30', bg: 'bg-gold/5', hover: 'hover:bg-gold/10' },
    signal: { fg: '#00FF88', border: 'border-signal/30', bg: 'bg-signal/5', hover: 'hover:bg-signal/10' },
    blue: { fg: '#4D7CFF', border: 'border-blue/30', bg: 'bg-blue/5', hover: 'hover:bg-blue/10' },
    warning: { fg: '#FF3D57', border: 'border-warning/30', bg: 'bg-warning/5', hover: 'hover:bg-warning/10' },
  }[tone];

  return (
    <button
      onClick={onChange}
      className={cn(
        'flex items-start gap-3 p-3 rounded border bg-elevated transition-all text-left group',
        on ? `${colors.border} ${colors.bg} ${colors.hover}` : 'border-border-subtle hover:border-border-hover',
      )}
    >
      <Icon size={14} style={{ color: on ? colors.fg : '#3A3A48' }} className="mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[11px] font-semibold text-[#EAEAEF]">{label}</p>
        <p className="font-mono text-[10px] text-ghost mt-0.5 line-clamp-2">{hint}</p>
      </div>
      <span className={cn('relative w-7 h-4 rounded-full flex-shrink-0 mt-1', on ? '' : 'border border-border-hover')} style={on ? { background: `${colors.fg}30` } : { background: 'transparent' }}>
        <span className={cn('absolute top-0.5 w-3 h-3 rounded-full transition-all', on ? 'left-[14px]' : 'left-0.5 bg-ghost')} style={on ? { background: colors.fg } : undefined} />
      </span>
    </button>
  );
}

function SysStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] text-ghost">{label}</span>
      <span className="font-mono text-[11px] font-semibold" style={{ color }}>{value}</span>
    </div>
  );
}
