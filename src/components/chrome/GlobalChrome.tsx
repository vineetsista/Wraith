'use client';

import { usePathname } from 'next/navigation';
import CommandPalette from './CommandPalette';
import AssistantDrawer from './AssistantDrawer';
import ToastStack from './ToastStack';
import LiveStream from './LiveStream';
import MoneyMode from './MoneyMode';
import AssistantFAB from './AssistantFAB';
import KeyboardShortcuts from './KeyboardShortcuts';
import OnboardingTour from './OnboardingTour';

export default function GlobalChrome() {
  const pathname = usePathname() ?? '';
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      <CommandPalette />
      <AssistantDrawer />
      <ToastStack />
      <MoneyMode />
      {isDashboard && (
        <>
          <LiveStream />
          <AssistantFAB />
          <KeyboardShortcuts />
          <OnboardingTour />
        </>
      )}
    </>
  );
}
