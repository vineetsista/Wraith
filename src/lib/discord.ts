import { Signal } from '@/types';
import { formatCurrency, getPlatformLabel, getUrgencyConfig } from './utils';

export async function sendDiscordAlert(webhookUrl: string, signal: Signal): Promise<boolean> {
  const urgencyConfig = getUrgencyConfig(signal.urgency);
  const color = signal.urgency === 'act_now' ? 0xFF3D57 : signal.urgency === 'within_48hrs' ? 0xFFB800 : 0x3A3A48;

  const embed = {
    title: `⚡ ${urgencyConfig.label} — ${signal.itemName}`,
    color,
    fields: [
      {
        name: '📥 Buy',
        value: `${getPlatformLabel(signal.buyPlatform)}\n${formatCurrency(signal.buyPrice)}`,
        inline: true,
      },
      {
        name: '📤 Sell',
        value: `${getPlatformLabel(signal.sellPlatform)}\n${formatCurrency(signal.sellPrice)}`,
        inline: true,
      },
      {
        name: '💰 Profit',
        value: `**${formatCurrency(signal.profit)}** (+${signal.roi.toFixed(1)}% ROI)`,
        inline: true,
      },
      {
        name: '🎯 Confidence',
        value: `${signal.confidence}%`,
        inline: true,
      },
      {
        name: '📊 Type',
        value: signal.signalType.replace(/_/g, ' ').toUpperCase(),
        inline: true,
      },
      {
        name: '🔥 Social Score',
        value: signal.socialScore?.toString() || 'N/A',
        inline: true,
      },
    ],
    description: signal.aiNarrative,
    footer: {
      text: 'Wraith Intelligence Platform • See the spread before anyone else',
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Wraith',
        avatar_url: 'https://wraith.gg/logo.png',
        embeds: [embed],
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function sendDiscordTestAlert(webhookUrl: string): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Wraith',
        embeds: [{
          title: '✅ Wraith Connected Successfully',
          color: 0x00FF88,
          description: 'Your Discord webhook is connected. You\'ll receive real-time arbitrage alerts here when signals match your confidence and profit thresholds.',
          footer: { text: 'Wraith Intelligence Platform' },
          timestamp: new Date().toISOString(),
        }],
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
