'use client';

import { ReactNode } from 'react';
import { WraithProvider } from '@/lib/wraith-context';
import { ActivityProvider } from '@/lib/activity-context';
import { CommandPaletteProvider } from '@/lib/command-palette-context';
import { AssistantProvider } from '@/lib/assistant-context';
import GlobalChrome from './chrome/GlobalChrome';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WraithProvider>
      <ActivityProvider>
        <AssistantProvider>
          <CommandPaletteProvider>
            {children}
            <GlobalChrome />
          </CommandPaletteProvider>
        </AssistantProvider>
      </ActivityProvider>
    </WraithProvider>
  );
}
