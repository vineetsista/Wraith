'use client';

interface SparklineChartProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

export default function SparklineChart({
  data,
  color = '#00FF88',
  width = 80,
  height = 28,
  fill = true,
}: SparklineChartProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * (height - 4) - 2,
  }));

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');

  const fillPath = [
    `M ${points[0].x},${height}`,
    ...points.map(p => `L ${p.x},${p.y}`),
    `L ${points[points.length - 1].x},${height}`,
    'Z',
  ].join(' ');

  const trend = data[data.length - 1] > data[0];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {fill && (
        <path
          d={fillPath}
          fill={trend ? 'rgba(0,255,136,0.08)' : 'rgba(255,61,87,0.08)'}
        />
      )}
      <polyline
        points={polyline}
        fill="none"
        stroke={trend ? color : '#FF3D57'}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="2"
        fill={trend ? color : '#FF3D57'}
      />
    </svg>
  );
}
