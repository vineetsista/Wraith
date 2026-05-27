'use client';

import { useState } from 'react';
import { Save, TestTube, ExternalLink, Copy, RefreshCw, Check, Shield, Eye, EyeOff, Volume2, VolumeX, Pause, Play, Compass, Keyboard, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWraith } from '@/lib/wraith-context';

export default function SettingsPage() {
  const { user, isAdmin, viewMode, toggleViewMode, demoMode, toggleDemoMode, soundEnabled, toggleSound, liveMode, toggleLiveMode, resetTour } = useWraith();
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [minProfit, setMinProfit] = useState(30);
  const [minConfidence, setMinConfidence] = useState(70);
  const [categories, setCategories] = useState(['sneakers', 'streetwear', 'trading_cards']);
  const [notifyFreq, setNotifyFreq] = useState('immediate');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [saved, setSaved] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const API_KEY = 'wraith_sk_demo_' + 'x'.repeat(24);

  const ALL_CATEGORIES = [
    { value: 'sneakers', label: 'Sneakers' },
    { value: 'streetwear', label: 'Streetwear' },
    { value: 'trading_cards', label: 'Trading Cards' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'collectibles', label: 'Collectibles' },
  ];

  async function testDiscord() {
    if (!discordWebhook) return;
    setTestStatus('testing');
    await new Promise(r => setTimeout(r, 1500));
    setTestStatus('success');
    setTimeout(() => setTestStatus('idle'), 3000);
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function copyKey() {
    navigator.clipboard.writeText(API_KEY);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-void">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-serif text-[28px] text-[#EAEAEF] mb-1">Settings</h1>
          <p className="font-mono text-[12px] text-ghost">Configure your Wraith experience</p>
        </div>

        <div className="space-y-4">
          {/* Profile */}
          <section className="rounded-lg border border-border-subtle bg-surface p-5">
            <h2 className="font-semibold text-[15px] text-[#EAEAEF] mb-4">Profile</h2>
            <div className="space-y-3">
              <div>
                <label className="font-mono text-[11px] text-ghost uppercase tracking-wider block mb-1.5">Name</label>
                <input
                  defaultValue={user?.name || 'Demo User'}
                  className="w-full h-9 px-3 bg-elevated border border-border-subtle rounded font-mono text-[13px] text-[#EAEAEF] focus:border-border-hover focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="font-mono text-[11px] text-ghost uppercase tracking-wider block mb-1.5">Email</label>
                <input
                  defaultValue={user?.email || 'demo@wraith.gg'}
                  className="w-full h-9 px-3 bg-elevated border border-border-subtle rounded font-mono text-[13px] text-secondary focus:border-border-hover focus:outline-none transition-colors"
                  disabled
                />
              </div>
              {isAdmin && (
                <div className="flex items-center gap-2 mt-1 p-2 rounded border border-warning/25 bg-warning/5">
                  <Shield size={12} className="text-warning" />
                  <p className="font-mono text-[11px] text-warning">Admin account · full console access</p>
                </div>
              )}
            </div>
          </section>

          {/* Demo & Presentation (admin only) */}
          {isAdmin && (
            <section className="rounded-lg border border-warning/25 bg-warning/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-semibold text-[15px] text-[#EAEAEF] flex items-center gap-2"><Sparkles size={13} className="text-warning" /> Demo &amp; Presentation</h2>
                  <p className="font-mono text-[11px] text-secondary mt-0.5">Controls only visible to admins. Toggle these for live demos.</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                <SettingsToggle
                  icon={Shield}
                  label="View Mode"
                  value={viewMode === 'admin' ? 'ADMIN' : 'USER'}
                  hint={viewMode === 'admin' ? 'Full admin surface visible' : 'Seeing the user-facing app'}
                  on={viewMode === 'admin'}
                  onChange={toggleViewMode}
                />
                <SettingsToggle
                  icon={demoMode ? Eye : EyeOff}
                  label="Demo Data"
                  value={demoMode ? 'ON' : 'OFF'}
                  hint={demoMode ? '30+ sample signals, portfolio history' : 'Real (empty) state'}
                  on={demoMode}
                  onChange={toggleDemoMode}
                />
                <SettingsToggle
                  icon={liveMode ? Pause : Play}
                  label="Live Signal Stream"
                  value={liveMode ? 'LIVE' : 'PAUSED'}
                  hint={liveMode ? 'New signals arriving in feed' : 'Stream frozen'}
                  on={liveMode}
                  onChange={toggleLiveMode}
                />
                <SettingsToggle
                  icon={soundEnabled ? Volume2 : VolumeX}
                  label="Notification Sounds"
                  value={soundEnabled ? 'ON' : 'OFF'}
                  hint={soundEnabled ? 'Soft ping on new signal' : 'Muted'}
                  on={soundEnabled}
                  onChange={toggleSound}
                />
              </div>
              <button
                onClick={resetTour}
                className="mt-3 inline-flex items-center gap-1.5 h-8 px-3 rounded border border-border-subtle bg-elevated font-mono text-[11px] text-secondary hover:text-[#EAEAEF] transition-colors"
              >
                <Compass size={11} /> Reset onboarding tour
              </button>
            </section>
          )}

          {/* Signal preferences */}
          <section className="rounded-lg border border-border-subtle bg-surface p-5">
            <h2 className="font-semibold text-[15px] text-[#EAEAEF] mb-4">Signal Preferences</h2>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-[11px] text-ghost uppercase tracking-wider">Minimum Profit</label>
                  <span className="font-mono text-[13px] text-signal">${minProfit}</span>
                </div>
                <input
                  type="range" min={0} max={200} step={5} value={minProfit}
                  onChange={e => setMinProfit(Number(e.target.value))}
                  className="w-full h-1 bg-elevated rounded cursor-pointer accent-signal"
                />
                <div className="flex justify-between mt-1">
                  <span className="font-mono text-[10px] text-ghost">$0</span>
                  <span className="font-mono text-[10px] text-ghost">$200</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-[11px] text-ghost uppercase tracking-wider">Minimum Confidence</label>
                  <span className="font-mono text-[13px] text-signal">{minConfidence}%</span>
                </div>
                <input
                  type="range" min={0} max={100} step={5} value={minConfidence}
                  onChange={e => setMinConfidence(Number(e.target.value))}
                  className="w-full h-1 bg-elevated rounded cursor-pointer accent-signal"
                />
                <div className="flex justify-between mt-1">
                  <span className="font-mono text-[10px] text-ghost">0%</span>
                  <span className="font-mono text-[10px] text-ghost">100%</span>
                </div>
              </div>

              <div>
                <label className="font-mono text-[11px] text-ghost uppercase tracking-wider block mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CATEGORIES.map(cat => {
                    const active = categories.includes(cat.value);
                    return (
                      <button
                        key={cat.value}
                        onClick={() => setCategories(prev =>
                          active ? prev.filter(c => c !== cat.value) : [...prev, cat.value]
                        )}
                        className={cn(
                          'h-7 px-3 rounded border font-mono text-[11px] transition-all',
                          active
                            ? 'border-signal/30 bg-signal/10 text-signal'
                            : 'border-border-subtle bg-elevated text-ghost hover:text-secondary'
                        )}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Discord */}
          <section className="rounded-lg border border-border-subtle bg-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-[15px] text-[#EAEAEF]">Discord Alerts</h2>
                <p className="font-mono text-[11px] text-ghost">Real-time signal notifications to your server</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="font-mono text-[11px] text-ghost uppercase tracking-wider block mb-1.5">Webhook URL</label>
                <input
                  type="url"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={discordWebhook}
                  onChange={e => setDiscordWebhook(e.target.value)}
                  className="w-full h-9 px-3 bg-elevated border border-border-subtle rounded font-mono text-[12px] text-[#EAEAEF] placeholder:text-ghost focus:border-border-hover focus:outline-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={testDiscord}
                  disabled={!discordWebhook || testStatus === 'testing'}
                  className={cn(
                    'h-8 px-4 rounded border font-mono text-[12px] flex items-center gap-1.5 transition-all',
                    testStatus === 'success' ? 'border-signal/30 bg-signal/10 text-signal' :
                    testStatus === 'error' ? 'border-warning/30 bg-warning/10 text-warning' :
                    'border-border-subtle bg-elevated text-secondary hover:text-[#EAEAEF] disabled:opacity-40'
                  )}
                >
                  {testStatus === 'testing' ? (
                    <><RefreshCw size={11} className="animate-spin" /> Testing...</>
                  ) : testStatus === 'success' ? (
                    <><Check size={11} /> Sent!</>
                  ) : (
                    <><TestTube size={11} /> Test Webhook</>
                  )}
                </button>
                <a
                  href="https://support.discord.com/hc/en-us/articles/228383668"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 px-3 rounded border border-border-subtle bg-elevated font-mono text-[12px] text-ghost hover:text-[#EAEAEF] flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink size={11} /> How to get a webhook
                </a>
              </div>
            </div>
          </section>

          {/* API Key */}
          <section className="rounded-lg border border-border-subtle bg-surface p-5">
            <h2 className="font-semibold text-[15px] text-[#EAEAEF] mb-1">API Access</h2>
            <p className="font-mono text-[11px] text-ghost mb-4">Access Wraith data programmatically</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 h-9 px-3 bg-elevated border border-border-subtle rounded font-mono text-[11px] text-ghost flex items-center overflow-hidden">
                {API_KEY}
              </code>
              <button
                onClick={copyKey}
                className={cn(
                  'h-9 w-9 flex-shrink-0 rounded border flex items-center justify-center transition-all',
                  apiKeyCopied
                    ? 'border-signal/30 bg-signal/10 text-signal'
                    : 'border-border-subtle bg-elevated text-ghost hover:text-[#EAEAEF]'
                )}
              >
                {apiKeyCopied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          </section>

          {/* Save button */}

          <button
            onClick={save}
            className={cn(
              'w-full h-10 rounded border font-mono text-[13px] font-semibold flex items-center justify-center gap-2 transition-all',
              saved
                ? 'border-signal/40 bg-signal/10 text-signal'
                : 'border-border-hover bg-elevated text-[#EAEAEF] hover:bg-surface hover:border-border-hover'
            )}
          >
            {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsToggle({ icon: Icon, label, value, hint, on, onChange }: {
  icon: any; label: string; value: string; hint: string; on: boolean; onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'flex items-start gap-3 p-3 rounded border bg-elevated transition-all text-left group',
        on ? 'border-warning/40 bg-warning/5 hover:bg-warning/10' : 'border-border-subtle hover:border-border-hover',
      )}
    >
      <Icon size={14} style={{ color: on ? '#FFB800' : '#3A3A48' }} className="mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-mono text-[11px] font-semibold text-[#EAEAEF]">{label}</p>
          <span className={cn('font-mono text-[9px] px-1.5 py-0.5 rounded', on ? 'text-warning bg-warning/10' : 'text-ghost bg-elevated')}>{value}</span>
        </div>
        <p className="font-mono text-[10px] text-ghost mt-0.5 line-clamp-2">{hint}</p>
      </div>
    </button>
  );
}
