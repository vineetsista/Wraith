'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export const ADMIN_EMAIL = 'vineet.sista@gmail.com';

export type ViewMode = 'admin' | 'user';

export interface WraithUser {
  email: string;
  name: string;
  plan: 'pro' | 'trial' | 'free';
  joinedAt: string;
}

interface WraithContextValue {
  hydrated: boolean;
  user: WraithUser | null;
  isAdmin: boolean;
  viewMode: ViewMode;
  demoMode: boolean;
  soundEnabled: boolean;
  liveMode: boolean;
  notificationsEnabled: boolean;
  hasSeenTour: boolean;
  setUser: (user: WraithUser | null) => void;
  signIn: (email: string) => void;
  signOut: () => void;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  setDemoMode: (on: boolean) => void;
  toggleDemoMode: () => void;
  setSoundEnabled: (on: boolean) => void;
  toggleSound: () => void;
  setLiveMode: (on: boolean) => void;
  toggleLiveMode: () => void;
  setNotificationsEnabled: (on: boolean) => void;
  markTourSeen: () => void;
  resetTour: () => void;
}

const WraithContext = createContext<WraithContextValue | null>(null);

const STORAGE_KEY = 'wraith:state:v1';

interface PersistedState {
  user: WraithUser | null;
  viewMode: ViewMode;
  demoMode: boolean;
  soundEnabled: boolean;
  liveMode: boolean;
  notificationsEnabled: boolean;
  hasSeenTour: boolean;
}

const DEFAULT_USER: WraithUser = {
  email: ADMIN_EMAIL,
  name: 'Vineet Sista',
  plan: 'pro',
  joinedAt: '2024-09-12',
};

const DEFAULT_STATE: PersistedState = {
  user: DEFAULT_USER,
  viewMode: 'admin',
  demoMode: true,
  soundEnabled: false,
  liveMode: true,
  notificationsEnabled: true,
  hasSeenTour: false,
};

function loadState(): PersistedState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: PersistedState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function WraithProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const isAdmin = state.user?.email?.toLowerCase() === ADMIN_EMAIL;

  const setUser = useCallback((user: WraithUser | null) => {
    setState(prev => ({ ...prev, user }));
  }, []);

  const signIn = useCallback((email: string) => {
    const normalized = email.trim().toLowerCase();
    const admin = normalized === ADMIN_EMAIL;
    setState(prev => ({
      ...prev,
      user: {
        email: normalized,
        name: admin ? 'Vineet Sista' : email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        plan: 'pro',
        joinedAt: prev.user?.joinedAt ?? new Date().toISOString().slice(0, 10),
      },
      viewMode: admin ? prev.viewMode : 'user',
      // Non-admin accounts always get the live (no demo overlay) experience
      demoMode: admin ? prev.demoMode : false,
    }));
  }, []);

  const signOut = useCallback(() => {
    setState({ ...DEFAULT_STATE, user: null, demoMode: false, viewMode: 'user', hasSeenTour: false });
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setState(prev => (prev.user?.email?.toLowerCase() === ADMIN_EMAIL ? { ...prev, viewMode: mode } : prev));
  }, []);

  const toggleViewMode = useCallback(() => {
    setState(prev => {
      if (prev.user?.email?.toLowerCase() !== ADMIN_EMAIL) return prev;
      return { ...prev, viewMode: prev.viewMode === 'admin' ? 'user' : 'admin' };
    });
  }, []);

  const setDemoMode = useCallback((on: boolean) => {
    setState(prev => ({ ...prev, demoMode: on }));
  }, []);

  const toggleDemoMode = useCallback(() => {
    setState(prev => ({ ...prev, demoMode: !prev.demoMode }));
  }, []);

  const setSoundEnabled = useCallback((on: boolean) => {
    setState(prev => ({ ...prev, soundEnabled: on }));
  }, []);

  const toggleSound = useCallback(() => {
    setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const setLiveMode = useCallback((on: boolean) => {
    setState(prev => ({ ...prev, liveMode: on }));
  }, []);

  const toggleLiveMode = useCallback(() => {
    setState(prev => ({ ...prev, liveMode: !prev.liveMode }));
  }, []);

  const setNotificationsEnabled = useCallback((on: boolean) => {
    setState(prev => ({ ...prev, notificationsEnabled: on }));
  }, []);

  const markTourSeen = useCallback(() => {
    setState(prev => ({ ...prev, hasSeenTour: true }));
  }, []);

  const resetTour = useCallback(() => {
    setState(prev => ({ ...prev, hasSeenTour: false }));
  }, []);

  return (
    <WraithContext.Provider
      value={{
        hydrated,
        user: state.user,
        isAdmin,
        viewMode: state.viewMode,
        demoMode: state.demoMode,
        soundEnabled: state.soundEnabled,
        liveMode: state.liveMode,
        notificationsEnabled: state.notificationsEnabled,
        hasSeenTour: state.hasSeenTour,
        setUser,
        signIn,
        signOut,
        setViewMode,
        toggleViewMode,
        setDemoMode,
        toggleDemoMode,
        setSoundEnabled,
        toggleSound,
        setLiveMode,
        toggleLiveMode,
        setNotificationsEnabled,
        markTourSeen,
        resetTour,
      }}
    >
      {children}
    </WraithContext.Provider>
  );
}

export function useWraith() {
  const ctx = useContext(WraithContext);
  if (!ctx) {
    throw new Error('useWraith must be used within WraithProvider');
  }
  return ctx;
}
