import DashboardNav from '@/components/DashboardNav';
import LiveTicker from '@/components/chrome/LiveTicker';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-void">
      <DashboardNav />
      <div className="pt-12">
        <LiveTicker />
      </div>
      <main>{children}</main>
    </div>
  );
}
