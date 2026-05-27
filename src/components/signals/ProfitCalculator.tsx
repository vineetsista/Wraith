'use client';

import { useMemo, useState } from 'react';
import { Calculator, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { Signal } from '@/types';
import { formatCurrency } from '@/lib/utils';

const FEE_RATES: Record<string, number> = {
  stockx: 0.095,
  goat: 0.095,
  ebay: 0.129,
  mercari: 0.10,
  grailed: 0.09,
};

const SHIPPING = 12;
const PAYMENT_PROCESSING = 0.029;

export default function ProfitCalculator({ signal }: { signal: Signal }) {
  const [units, setUnits] = useState(1);
  const [sellPrice, setSellPrice] = useState(signal.sellPrice);
  const [discount, setDiscount] = useState(0); // % below buyPrice
  const [holdDays, setHoldDays] = useState(5);

  const effectiveBuy = useMemo(() => signal.buyPrice * (1 - discount / 100), [signal.buyPrice, discount]);
  const sellFees = useMemo(() => sellPrice * (FEE_RATES[signal.sellPlatform] ?? 0.1), [sellPrice, signal.sellPlatform]);
  const paymentFees = useMemo(() => sellPrice * PAYMENT_PROCESSING, [sellPrice]);
  const totalFees = sellFees + paymentFees + SHIPPING;
  const netPerUnit = sellPrice - effectiveBuy - totalFees;
  const totalProfit = netPerUnit * units;
  const totalCost = effectiveBuy * units;
  const roi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  const dailyRate = holdDays > 0 ? totalProfit / holdDays : 0;
  const annualizedROI = holdDays > 0 ? (roi * 365) / holdDays : 0;

  return (
    <div className="rounded-lg border border-border-subtle bg-surface overflow-hidden">
      <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator size={13} className="text-signal" />
          <h2 className="font-semibold text-[14px] text-[#EAEAEF]">Profit Simulator</h2>
        </div>
        <span className="font-mono text-[10px] text-ghost">live calculation</span>
      </div>

      <div className="p-5 grid md:grid-cols-2 gap-5">
        {/* Controls */}
        <div className="space-y-3.5">
          <Field
            label="Units"
            hint="How many you can secure"
            value={units}
            min={1}
            max={20}
            step={1}
            format={(v) => `${v}`}
            onChange={setUnits}
          />
          <Field
            label="Negotiated discount"
            hint="% off the listing"
            value={discount}
            min={0}
            max={30}
            step={1}
            format={(v) => `${v}%`}
            onChange={setDiscount}
          />
          <Field
            label="Target sell price"
            hint={`Listed comp: ${formatCurrency(signal.sellPrice)}`}
            value={sellPrice}
            min={Math.round(signal.sellPrice * 0.7)}
            max={Math.round(signal.sellPrice * 1.4)}
            step={5}
            format={(v) => formatCurrency(v)}
            onChange={setSellPrice}
          />
          <Field
            label="Hold time (days)"
            hint="Avg sell-through window"
            value={holdDays}
            min={1}
            max={60}
            step={1}
            format={(v) => `${v}d`}
            onChange={setHoldDays}
          />
        </div>

        {/* Breakdown */}
        <div className="rounded-lg border border-signal/20 bg-signal/5 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] text-ghost uppercase tracking-wider">Projected total</span>
            <span className="font-mono text-[10px] text-signal">{units} unit{units > 1 ? 's' : ''}</span>
          </div>
          <p className="font-mono text-[36px] font-bold text-signal leading-none mb-1" style={{ textShadow: '0 0 20px rgba(0,255,136,0.3)' }}>
            {formatCurrency(totalProfit)}
          </p>
          <p className="font-mono text-[11px] text-secondary mb-4">
            {roi >= 0 ? '+' : ''}{roi.toFixed(1)}% ROI · {formatCurrency(dailyRate)}/day
          </p>

          <div className="space-y-1.5 mt-auto pt-3 border-t border-signal/15">
            <Row label="Revenue" value={formatCurrency(sellPrice * units)} />
            <Row label="Cost basis" value={`-${formatCurrency(effectiveBuy * units)}`} />
            <Row label={`Sell fees (${(FEE_RATES[signal.sellPlatform] * 100).toFixed(1)}%)`} value={`-${formatCurrency(sellFees * units)}`} />
            <Row label="Payment processing" value={`-${formatCurrency(paymentFees * units)}`} />
            <Row label="Shipping × units" value={`-${formatCurrency(SHIPPING * units)}`} />
            <div className="border-t border-signal/15 pt-1.5 mt-1.5">
              <Row label="Net" value={formatCurrency(totalProfit)} bold accent />
            </div>
            <Row label="Annualized ROI" value={`${annualizedROI.toFixed(0)}%`} muted />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, value, min, max, step, format, onChange }: {
  label: string; hint?: string; value: number; min: number; max: number; step: number; format: (v: number) => string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="font-mono text-[11px] text-[#EAEAEF]">{label}</p>
          {hint && <p className="font-mono text-[10px] text-ghost">{hint}</p>}
        </div>
        <p className="font-mono text-[12px] font-bold text-signal">{format(value)}</p>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#00FF88]"
      />
    </div>
  );
}

function Row({ label, value, bold, accent, muted }: { label: string; value: string; bold?: boolean; accent?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] text-ghost">{label}</span>
      <span className={`font-mono text-[11px] ${bold ? 'font-bold' : ''} ${accent ? 'text-signal' : muted ? 'text-secondary' : 'text-[#EAEAEF]'}`}>{value}</span>
    </div>
  );
}
