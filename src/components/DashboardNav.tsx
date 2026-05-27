'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Zap, BarChart2, Star, Calendar, Settings,
  User, ChevronDown, LogOut, Menu, X, Shield,
  Search, Sparkles, Briefcase, Eye, EyeOff, Activity, Volume2, VolumeX, Pause, Play, ArrowLeftRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWraith, ADMIN_EMAIL } from '@/lib/wraith-context';
import { useCommandPalette } from '@/lib/command-palette-context';
import { useAssistant } from '@/lib/assistant-context';
import { NotificationBell } from './chrome/ActivityPanel';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Signals', icon: Zap },
  { href: '/dashboard/watchlist', label: 'Watchlist', icon: Star },
  { href: '/dashboard/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dashboard/drops', label: 'Drops', icon: Calendar },
];

interface DashboardNavProps {
  scanCount?: number;
}

export default function DashboardNav({ scanCount = 47284 }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user, isAdmin, viewMode, toggleViewMode,
    demoMode, toggleDemoMode, soundEnabled, toggleSound,
    liveMode, toggleLiveMode, signOut,
  } = useWraith();
  const { setOpen: setCmdOpen } = useCommandPalette();
  const { toggle: toggleAi } = useAssistant();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = user?.name || 'Demo User';
  const displayEmail = user?.email || 'demo@wraith.app';

  const navItems = [...NAV_ITEMS];
  if (isAdmin && viewMode === 'admin') {
    navItems.push({ href: '/dashboard/admin', label: 'Admin', icon: Shield });
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between pl-4 pr-3 sm:px-6 border-b border-border-subtle"
        style={{ background: 'rgba(5, 5, 7, 0.92)', backdropFilter: 'blur(20px)' }}
      >
        {/* Logo + indicators */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-6 h-6 rounded border border-signal/40 flex items-center justify-center bg-signal/5 group-hover:bg-signal/10 transition-colors">
              <Zap size={12} className="text-signal" fill="currentColor" />
            </div>
            <span className="font-serif text-[16px] text-[#EAEAEF]">Wraith</span>
          </Link>

          {/* Live scan indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded border border-border-subtle bg-elevated">
            <span className={cn('w-1.5 h-1.5 rounded-full', liveMode ? 'bg-signal animate-pulse-fast' : 'bg-ghost')} />
            <span className="font-mono text-[10px] text-ghost">
              {liveMode ? `${scanCount.toLocaleString()} scanned` : 'PAUSED'}
            </span>
          </div>

          {isAdmin && (
            <button
              onClick={toggleViewMode}
              title={`Switch to ${viewMode === 'admin' ? 'User' : 'Admin'} view`}
              className={cn(
                'hidden md:flex items-center gap-1.5 px-2 py-1 rounded border font-mono text-[10px] transition-colors',
                viewMode === 'admin'
                  ? 'border-warning/40 bg-warning/10 text-warning'
                  : 'border-signal/40 bg-signal/10 text-signal',
              )}
            >
              <Shield size={10} />
              {viewMode.toUpperCase()} VIEW
              <ArrowLeftRight size={9} className="opacity-50" />
            </button>
          )}

          {isAdmin && demoMode && (
            <span className="hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded border border-gold/30 bg-gold/5 font-mono text-[9px] text-gold">
              <Eye size={9} /> DEMO DATA
            </span>
          )}
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 h-8 px-3 rounded font-mono text-[12px] transition-all',
                  active
                    ? 'text-signal bg-signal/10 border border-signal/20'
                    : 'text-secondary hover:text-[#EAEAEF] hover:bg-elevated',
                )}
              >
                <Icon size={12} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCmdOpen(true)}
            title="Search (⌘K)"
            className="hidden sm:flex items-center gap-1.5 h-7 px-2 rounded border border-border-subtle bg-elevated text-ghost hover:text-[#EAEAEF] transition-colors"
          >
            <Search size={11} />
            <kbd className="font-mono text-[9px] hidden md:inline">⌘K</kbd>
          </button>

          <button
            onClick={toggleAi}
            title="Ask Wraith Intelligence (⌘J)"
            className="w-7 h-7 rounded border border-signal/30 bg-signal/5 text-signal hover:bg-signal/10 flex items-center justify-center transition-colors"
          >
            <Sparkles size={12} />
          </button>

          <NotificationBell />

          <Link href="/dashboard/settings" className="hidden md:flex w-7 h-7 rounded border border-border-subtle bg-elevated items-center justify-center text-ghost hover:text-[#EAEAEF] transition-colors" title="Settings">
            <Settings size={11} />
          </Link>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1.5 h-7 pl-1 pr-2 rounded border border-border-subtle bg-elevated hover:border-border-hover transition-colors"
            >
              <div className={cn('w-5 h-5 rounded-full flex items-center justify-center', isAdmin ? 'bg-warning/20 text-warning' : 'bg-signal/20 text-signal')}>
                <User size={10} />
              </div>
              <ChevronDown size={10} className="text-ghost" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-10 w-56 rounded-lg border border-border-hover bg-elevated shadow-card overflow-hidden z-50 animate-fade-in">
                  <div className="px-3 py-2.5 border-b border-border-subtle">
                    <p className="font-mono text-[11px] text-[#EAEAEF] font-semibold truncate">{displayName}</p>
                    <p className="font-mono text-[10px] text-ghost truncate">{displayEmail}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-signal/30 bg-signal/10 text-signal">PRO</span>
                      {isAdmin && <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-warning/30 bg-warning/10 text-warning">ADMIN</span>}
                    </div>
                  </div>

                  {isAdmin && (
                    <>
                      <div className="px-2 pt-2 pb-1">
                        <p className="font-mono text-[9px] text-ghost uppercase tracking-wider px-1">Admin Controls</p>
                      </div>
                      <button
                        onClick={() => { toggleViewMode(); setUserMenuOpen(false); }}
                        className="w-full flex items-center justify-between px-3 py-2 text-[12px] text-secondary hover:text-[#EAEAEF] hover:bg-void transition-colors"
                      >
                        <span className="flex items-center gap-2"><Shield size={11} /> View Mode</span>
                        <span className={cn('font-mono text-[10px] px-1.5 py-0.5 rounded border', viewMode === 'admin' ? 'border-warning/30 text-warning' : 'border-signal/30 text-signal')}>
                          {viewMode}
                        </span>
                      </button>
                      <button
                        onClick={toggleDemoMode}
                        className="w-full flex items-center justify-between px-3 py-2 text-[12px] text-secondary hover:text-[#EAEAEF] hover:bg-void transition-colors"
                      >
                        <span className="flex items-center gap-2">{demoMode ? <Eye size={11} /> : <EyeOff size={11} />} Demo Data</span>
                        <span className={cn('font-mono text-[10px]', demoMode ? 'text-signal' : 'text-ghost')}>{demoMode ? 'ON' : 'OFF'}</span>
                      </button>
                      <Link href="/dashboard/admin" onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-secondary hover:text-[#EAEAEF] hover:bg-void transition-colors">
                        <Activity size={11} /> Admin Console
                      </Link>
                      <div className="border-t border-border-subtle" />
                    </>
                  )}

                  <button
                    onClick={toggleLiveMode}
                    className="w-full flex items-center justify-between px-3 py-2 text-[12px] text-secondary hover:text-[#EAEAEF] hover:bg-void transition-colors"
                  >
                    <span className="flex items-center gap-2">{liveMode ? <Pause size={11} /> : <Play size={11} />} Live Stream</span>
                    <span className={cn('font-mono text-[10px]', liveMode ? 'text-signal' : 'text-ghost')}>{liveMode ? 'LIVE' : 'PAUSED'}</span>
                  </button>
                  <button
                    onClick={toggleSound}
                    className="w-full flex items-center justify-between px-3 py-2 text-[12px] text-secondary hover:text-[#EAEAEF] hover:bg-void transition-colors"
                  >
                    <span className="flex items-center gap-2">{soundEnabled ? <Volume2 size={11} /> : <VolumeX size={11} />} Sound</span>
                    <span className={cn('font-mono text-[10px]', soundEnabled ? 'text-signal' : 'text-ghost')}>{soundEnabled ? 'ON' : 'OFF'}</span>
                  </button>

                  <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 text-[12px] text-secondary hover:text-[#EAEAEF] hover:bg-void transition-colors border-t border-border-subtle" onClick={() => setUserMenuOpen(false)}>
                    <Settings size={11} /> Settings
                  </Link>
                  <button
                    onClick={() => { signOut(); setUserMenuOpen(false); router.push('/'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-warning hover:bg-void transition-colors border-t border-border-subtle"
                  >
                    <LogOut size={11} /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-7 h-7 rounded border border-border-subtle bg-elevated flex items-center justify-center text-secondary hover:text-[#EAEAEF] transition-colors"
          >
            {mobileOpen ? <X size={12} /> : <Menu size={12} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="fixed top-12 left-0 right-0 z-40 border-b border-border-subtle bg-void px-6 py-4 flex flex-col gap-1 md:hidden animate-slide-in-up">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2 h-10 px-3 rounded font-mono text-[13px] transition-all',
                  active
                    ? 'text-signal bg-signal/10 border border-signal/20'
                    : 'text-secondary hover:text-[#EAEAEF] hover:bg-elevated',
                )}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
