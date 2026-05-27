import { PrismaClient } from '@prisma/client';
import { MOCK_SIGNALS, MOCK_DROPS, MOCK_PRICE_HISTORIES } from '../src/lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.flipLog.deleteMany();
  await prisma.watchedItem.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.drop.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const user = await prisma.user.create({
    data: {
      email: 'demo@wraith.gg',
      name: 'Demo User',
      passwordHash: '$2b$10$demo_hash_placeholder',
      emailVerified: new Date(),
      subscriptionStatus: 'active',
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      minProfit: 30,
      minConfidence: 70,
      categories: ['sneakers', 'streetwear', 'trading_cards'],
      role: 'admin',
    },
  });
  console.log(`✓ Created demo user: ${user.email}`);

  // Seed signals
  for (const signal of MOCK_SIGNALS) {
    await prisma.signal.create({
      data: {
        id: signal.id,
        itemName: signal.itemName,
        brand: signal.brand,
        category: signal.category,
        imageGradient: signal.imageGradient,
        buyPlatform: signal.buyPlatform,
        buyPrice: signal.buyPrice,
        sellPlatform: signal.sellPlatform,
        sellPrice: signal.sellPrice,
        fees: signal.fees,
        profit: signal.profit,
        roi: signal.roi,
        confidence: signal.confidence,
        urgency: signal.urgency,
        signalType: signal.signalType,
        aiNarrative: signal.aiNarrative,
        socialScore: signal.socialScore,
        tiktokMentions: signal.tiktokMentions,
        size: signal.size,
        isActive: true,
        createdAt: signal.createdAt,
      },
    });
  }
  console.log(`✓ Seeded ${MOCK_SIGNALS.length} signals`);

  // Seed drops
  for (const drop of MOCK_DROPS) {
    await prisma.drop.create({
      data: {
        id: drop.id,
        itemName: drop.itemName,
        brand: drop.brand,
        category: drop.category,
        imageGradient: drop.imageGradient,
        retailPrice: drop.retailPrice,
        predictedResaleMin: drop.predictedResaleMin,
        predictedResaleMax: drop.predictedResaleMax,
        predictedProfit: drop.predictedProfit,
        releasePlatform: drop.releasePlatform,
        releaseDate: drop.releaseDate,
        difficultyRating: drop.difficultyRating,
        aiAnalysis: drop.aiAnalysis,
      },
    });
  }
  console.log(`✓ Seeded ${MOCK_DROPS.length} drops`);

  // Seed price history
  let phCount = 0;
  for (const [, history] of Object.entries(MOCK_PRICE_HISTORIES)) {
    for (const entry of history) {
      await prisma.priceHistory.create({
        data: {
          itemName: entry.itemName,
          platform: entry.platform,
          price: entry.price,
          recordedAt: entry.recordedAt,
        },
      });
      phCount++;
    }
  }
  console.log(`✓ Seeded ${phCount} price history records`);

  // Create some flip logs for demo
  const flippedSignals = MOCK_SIGNALS.slice(0, 3);
  for (const signal of flippedSignals) {
    await prisma.flipLog.create({
      data: {
        userId: user.id,
        signalId: signal.id,
        buyPrice: signal.buyPrice,
        sellPrice: signal.sellPrice,
        actualProfit: signal.profit * (0.85 + Math.random() * 0.3),
        platform: signal.sellPlatform,
        flippedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log(`✓ Seeded ${flippedSignals.length} flip logs`);

  console.log('\n✅ Database seeded successfully!');
  console.log(`\nDemo credentials:\n  Email: demo@wraith.gg\n  Password: any value (demo mode)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
