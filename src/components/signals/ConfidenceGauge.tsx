'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ConfidenceGaugeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  sm: { svgSize: 48, radius: 18, strokeWidth: 3, fontSize: '10px', labelSize: '7px' },
  md: { svgSize: 64, radius: 24, strokeWidth: 3.5, fontSize: '13px', labelSize: '8px' },
  lg: { svgSize: 88, radius: 34, strokeWidth: 4, fontSize: '17px', labelSize: '9px' },
};

function getArcColor(value: number): string {
  if (value >= 90) return '#00FF88';
  if (value >= 70) return '#00FF88';
  if (value >= 50) return '#FFB800';
  return '#3A3A48';
}

function getTrackColor(_value: number): string {
  return 'rgba(255,255,255,0.05)';
}

export default function ConfidenceGauge({
  value,
  size = 'md',
  showLabel = true,
  animate = true,
  className,
}: ConfidenceGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const config = SIZE_CONFIG[size];
  const { svgSize, radius, strokeWidth } = config;
  const center = svgSize / 2;
  const circumference = 2 * Math.PI * radius;

  // Arc is 270deg starting from bottom-left (-225deg / 225deg from top)
  const arcLength = circumference * 0.75;
  const dashOffset = arcLength - (arcLength * animatedValue) / 100;

  const arcColor = getArcColor(value);
  const trackColor = getTrackColor(value);
  const isHigh = value >= 90;
  const isGold = value >= 50 && value < 70;

  useEffect(() => {
    if (!animate) {
      setAnimatedValue(value);
      return;
    }

    const duration = 900;
    const startValue = 0;

    const tick = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(startValue + (value - startValue) * eased));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(tick);
      }
    };

    const timeout = setTimeout(() => {
      startTimeRef.current = null;
      animationRef.current = requestAnimationFrame(tick);
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [value, animate]);

  // The start angle for the 270deg arc:
  // We start at 135deg (bottom-left) and go 270deg clockwise
  const startAngle = 135;
  const endAngle = startAngle + 270;

  // Convert degrees to radians and get point on circle
  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
    const start = polarToCartesian(cx, cy, r, startDeg);
    const end = polarToCartesian(cx, cy, r, endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
  }

  const trackPath = arcPath(center, center, radius, startAngle, endAngle);
  const valuePath = arcPath(center, center, radius, startAngle, startAngle + (270 * animatedValue) / 100);

  const filterIdBase = `gauge-glow-${size}-${Math.round(value)}`;

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        style={{ overflow: 'visible' }}
        aria-label={`Confidence: ${value}%`}
      >
        <defs>
          {isHigh && (
            <filter id={filterIdBase} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          )}
          {isGold && (
            <filter id={`${filterIdBase}-gold`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          )}
        </defs>

        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Value arc - glow layer for high confidence */}
        {isHigh && (
          <path
            d={valuePath}
            fill="none"
            stroke={arcColor}
            strokeWidth={strokeWidth + 2}
            strokeLinecap="round"
            opacity={0.3}
            filter={`url(#${filterIdBase})`}
          />
        )}

        {/* Value arc */}
        <path
          d={valuePath}
          fill="none"
          stroke={arcColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={isHigh ? `url(#${filterIdBase})` : isGold ? `url(#${filterIdBase}-gold)` : undefined}
          style={{
            transition: 'none',
          }}
        />

        {/* Center number */}
        <text
          x={center}
          y={center + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: config.fontSize,
            fontWeight: 700,
            fill: arcColor,
            letterSpacing: '-0.5px',
          }}
        >
          {animatedValue}
        </text>

        {/* Pulsing dot at end of arc for 90+ */}
        {isHigh && animatedValue >= 85 && (
          <circle
            cx={polarToCartesian(center, center, radius, startAngle + (270 * animatedValue) / 100).x}
            cy={polarToCartesian(center, center, radius, startAngle + (270 * animatedValue) / 100).y}
            r={strokeWidth / 2 + 0.5}
            fill={arcColor}
            className="animate-pulse-fast"
          />
        )}
      </svg>

      {showLabel && (
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: config.labelSize,
            letterSpacing: '0.1em',
            marginTop: '2px',
          }}
          className="text-ghost uppercase"
        >
          CONF
        </span>
      )}
    </div>
  );
}
