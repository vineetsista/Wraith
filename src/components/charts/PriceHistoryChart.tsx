'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { PriceHistory, Platform } from '@/types';
import { getPlatformLabel, getPlatformColor, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface PriceHistoryChartProps {
  history: PriceHistory[];
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-elevated border border-border-hover rounded-lg p-3 shadow-card">
      <p className="font-mono text-[11px] text-ghost mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
          <span className="font-mono text-[11px] text-secondary">{entry.name}:</span>
          <span className="font-mono text-[11px] font-semibold" style={{ color: entry.color }}>
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function PriceHistoryChart({ history, height = 240 }: PriceHistoryChartProps) {
  if (!history.length) return null;

  // Group by date and platform
  const platforms = [...new Set(history.map(h => h.platform))] as Platform[];

  const dateMap = new Map<string, Record<string, number>>();

  history.forEach(item => {
    const date = format(new Date(item.recordedAt), 'MMM d');
    if (!dateMap.has(date)) dateMap.set(date, {});
    const entry = dateMap.get(date)!;
    entry[item.platform] = item.price;
  });

  // Sample every 7th data point to avoid overcrowding
  const allDates = [...dateMap.entries()];
  const sampled = allDates.filter((_, i) => i % 7 === 0 || i === allDates.length - 1);

  const chartData = sampled.map(([date, prices]) => ({
    date,
    ...prices,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#3A3A48' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#3A3A48' }}
          tickFormatter={(v) => `$${v}`}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{
            fontSize: '10px',
            fontFamily: 'JetBrains Mono',
            color: '#6B6B7B',
            paddingTop: '8px',
          }}
        />
        {platforms.map((platform) => (
          <Line
            key={platform}
            type="monotone"
            dataKey={platform}
            name={getPlatformLabel(platform)}
            stroke={getPlatformColor(platform)}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: getPlatformColor(platform) }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
