import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDexEconomics,
  calculateTrancheYields,
  DEFAULT_TRANCHES,
  SimulationParams
} from './economics';

test('calculateDexEconomics produces valid fee and yield outputs', () => {
  const params: SimulationParams = {
    dailyVolumeUsd: 1_000_000_000, // $1B daily volume
    takerFeeBps: 1.0, // 0.010% (1.0 bps)
    totalLpTvlUsd: 400_000_000, // $400M TVL
    marketVolatilityPct: 65,
    toxicFlowPct: 20,
    lvrProtectionEfficiency: 85,
  };

  const results = calculateDexEconomics(params);

  // Annual volume should be $365B
  assert.equal(results.annualVolumeUsd, 365_000_000_000);

  // 1.0 bps fee on $365B = $36.5M
  assert.equal(results.totalAnnualFeesUsd, 36_500_000);

  // Veritas 80% to LPs = $29.2M
  assert.equal(results.veritasLpRevenueUsd, 29_200_000);

  // 10% Insurance = $3.65M
  assert.equal(results.veritasInsuranceRevenueUsd, 3_650_000);

  // 10% Stakers = $3.65M
  assert.equal(results.veritasStakerRevenueUsd, 3_650_000);

  // Trader savings should be positive vs Hyperliquid (2.8 bps vs 1.0 bps = 1.8 bps savings)
  assert.ok(results.traderAnnualSavingsUsd > 0);
  assert.equal(results.traderSavingsPerMillionUsd, 180); // 1.8 bps of $1M is $180
  assert.ok(results.feeReductionPct > 60); // 1.8 / 2.8 = ~64.28%

  // LVR protection should save value
  assert.ok(results.veritasLvrSavedUsd > 0);

  // LP APR should be calculated properly
  assert.ok(results.veritasLpAprPct > 5);
});

test('calculateTrancheYields produces differentiated risk/reward tiers', () => {
  const baseLpApr = 20.0;
  const yields = calculateTrancheYields(baseLpApr, DEFAULT_TRANCHES);

  // Senior should be lower than Junior, but above minAprPct
  assert.ok(yields['senior'] >= 8.5);
  assert.ok(yields['junior'] > yields['senior']);
  assert.ok(yields['grid'] > yields['senior']);
  assert.ok(yields['junior'] > yields['grid']);
});
