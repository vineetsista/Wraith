import type { Metadata } from 'next';
import '../styles/globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Wraith — See the spread before anyone else',
  description: 'AI-powered arbitrage intelligence for sneakers, streetwear, and collectibles. Real-time signals across StockX, GOAT, eBay, Mercari, and Grailed.',
  keywords: ['sneaker reselling', 'arbitrage', 'StockX', 'GOAT', 'resale intelligence', 'price tracker'],
  openGraph: {
    title: 'Wraith — AI Resale Intelligence',
    description: 'See the spread before anyone else.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" />
      </head>
      <body className="min-h-screen bg-void text-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
