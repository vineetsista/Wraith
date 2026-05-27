import LandingHero from '@/components/landing/LandingHero';
import LiveSignalDemo from '@/components/landing/LiveSignalDemo';
import HowItWorks from '@/components/landing/HowItWorks';
import WhatWraithTracks from '@/components/landing/WhatWraithTracks';
import LandingPricing from '@/components/landing/LandingPricing';
import SocialProof from '@/components/landing/SocialProof';
import LandingFAQ from '@/components/landing/LandingFAQ';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingNav from '@/components/landing/LandingNav';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-void overflow-x-hidden">
      <LandingNav />
      <LandingHero />
      <LiveSignalDemo />
      <HowItWorks />
      <WhatWraithTracks />
      <LandingPricing />
      <SocialProof />
      <LandingFAQ />
      <LandingFooter />
    </main>
  );
}
