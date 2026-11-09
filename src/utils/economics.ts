/**
 * Core mathematical and economic calculations for Veritas DEX vs Hyperliquid comparison.
 * Pure logic decoupled from UI for deterministic testing and simulation.
 */

export interface SimulationParams {
  dailyVolumeUsd: number; // e.g. $1,000,000,000 ($1B)
  takerFeeBps: number; // e.g. 1.2 bps (0.012%) vs Hyperliquid ~2.5 - 3.5 bps
  totalLpTvlUsd: number; // e.g. $400,000,000 ($400M)
  marketVolatilityPct: number; // Annualized volatility, e.g. 65%
  toxicFlowPct: number; // % of flow that is informed/latency arbitrage, e.g. 20%
  lvrProtectionEfficiency: number; // Veritas LVR recapture rate (e.g. 85%)
}

export interface EconomicResults {
  // Annualized totals
  annualVolumeUsd: number;
  totalAnnualFeesUsd: number;

  // Veritas Distribution (Cost-Plus User-Owned Model)
  veritasLpRevenueUsd: number;
  veritasLpAprPct: number;
  veritasInsuranceRevenueUsd: number;
  veritasStakerRevenueUsd: number;

  // Hyperliquid Comparison Baseline
  hyperliquidTakerFeeBps: number;
  hyperliquidAnnualFeesUsd: number;
  hyperliquidHlpRevenueUsd: number;
  hyperliquidHlpAprPct: number;
  hyperliquidPlatformRetainedUsd: number;

  // Trader Advantage
  traderAnnualSavingsUsd: number;
  traderSavingsPerMillionUsd: number;
  feeReductionPct: number;

  // LVR (Loss-Versus-Rebalancing) Advantage
  estimatedUnmitigatedLvrLossUsd: number;
  veritasLvrSavedUsd: number;
  netLpYieldDeltaBps: number; // Net improvement in LP returns from LVR recapture
}

export interface PoolTranche {
  id: 'senior' | 'grid' | 'junior';
  name: string;
  targetRisk: 'Low' | 'Moderate' | 'High';
  capitalAllocationPct: number;
  feeWeight: number; // Multiplier on standard pool fee share
  hedgingCostPct: number; // Cost of delta-neutral options/perps hedging
  inventorySkewExposure: number; // 0 to 1
  minAprPct: number;
  projectedAprPct: number;
  description: string;
}

/**
 * Computes economic distributions for Veritas DEX vs. Hyperliquid.
 */
export function calculateDexEconomics(params: SimulationParams): EconomicResults {
  const annualVolumeUsd = params.dailyVolumeUsd * 365;
  const veritasFeeRate = params.takerFeeBps / 10000;
  const totalAnnualFeesUsd = annualVolumeUsd * veritasFeeRate;

  // Veritas Model Fee Split:
  // 80% to User-Owned Liquidity Providers
  // 10% to Transparent Insurance Fund
  // 10% to Staked Governance Token Burn/Yield
  const veritasLpRevenueUsd = totalAnnualFeesUsd * 0.80;
  const veritasInsuranceRevenueUsd = totalAnnualFeesUsd * 0.10;
  const veritasStakerRevenueUsd = totalAnnualFeesUsd * 0.10;

  // Hyperliquid baseline:
  // Typical average blended taker fee on Hyperliquid is ~2.8 bps (0.028%)
  const hyperliquidTakerFeeBps = 2.8;
  const hyperliquidFeeRate = hyperliquidTakerFeeBps / 10000;
  const hyperliquidAnnualFeesUsd = annualVolumeUsd * hyperliquidFeeRate;

  // On Hyperliquid, HLP vaults capture only a fraction of net exchange spread + liquidations,
  // while the Foundation/Ecosystem Treasury retains substantial transaction and trading fees.
  // Historical HLP payout effectively mirrors ~45% of total protocol fee intake,
  // with remaining ~55% retained by protocol/validator/foundation reserves.
  const hyperliquidHlpRevenueUsd = hyperliquidAnnualFeesUsd * 0.45;
  const hyperliquidPlatformRetainedUsd = hyperliquidAnnualFeesUsd * 0.55;

  // Loss-Versus-Rebalancing (LVR) theoretical loss:
  // Standard LVR formula approximation: LVR ~ 0.5 * sigma^2 * pool_liquidity * toxic_flow_factor
  // For perps/CLOB market making, toxic flow arbitrage costs LPs ~0.15% to 0.45% of trading volume when unhedged.
  const toxicFlowRatio = Math.max(0.05, Math.min(0.50, params.toxicFlowPct / 100));
  const estimatedUnmitigatedLvrLossUsd = annualVolumeUsd * (params.takerFeeBps / 10000) * toxicFlowRatio * 1.5;
  const veritasLvrSavedUsd = estimatedUnmitigatedLvrLossUsd * (params.lvrProtectionEfficiency / 100);

  // Net LP yields
  const safeTvl = Math.max(1_000_000, params.totalLpTvlUsd);
  const veritasLpAprPct = ((veritasLpRevenueUsd + veritasLvrSavedUsd) / safeTvl) * 100;
  const hyperliquidHlpAprPct = (hyperliquidHlpRevenueUsd / safeTvl) * 100;

  // Trader savings
  const traderAnnualSavingsUsd = Math.max(0, hyperliquidAnnualFeesUsd - totalAnnualFeesUsd);
  const feeReductionPct = ((hyperliquidTakerFeeBps - params.takerFeeBps) / hyperliquidTakerFeeBps) * 100;
  const traderSavingsPerMillionUsd = Math.round((hyperliquidFeeRate - veritasFeeRate) * 1_000_000 * 100) / 100;

  const netLpYieldDeltaBps = (veritasLpAprPct - hyperliquidHlpAprPct) * 100;

  return {
    annualVolumeUsd,
    totalAnnualFeesUsd,
    veritasLpRevenueUsd,
    veritasLpAprPct,
    veritasInsuranceRevenueUsd,
    veritasStakerRevenueUsd,
    hyperliquidTakerFeeBps,
    hyperliquidAnnualFeesUsd,
    hyperliquidHlpRevenueUsd,
    hyperliquidHlpAprPct,
    hyperliquidPlatformRetainedUsd,
    traderAnnualSavingsUsd,
    traderSavingsPerMillionUsd,
    feeReductionPct,
    estimatedUnmitigatedLvrLossUsd,
    veritasLvrSavedUsd,
    netLpYieldDeltaBps,
  };
}

/**
 * Calculates tranche-specific yields for user-owned pools.
 */
export function calculateTrancheYields(
  baseLpApr: number,
  tranches: PoolTranche[]
): Record<string, number> {
  const result: Record<string, number> = {};

  for (const t of tranches) {
    let projected = baseLpApr * t.feeWeight - t.hedgingCostPct;
    if (projected < t.minAprPct) {
      projected = t.minAprPct;
    }
    result[t.id] = Number(projected.toFixed(2));
  }

  return result;
}

export const DEFAULT_TRANCHES: PoolTranche[] = [
  {
    id: 'senior',
    name: 'Senior Delta-Neutral Vault',
    targetRisk: 'Low',
    capitalAllocationPct: 45,
    feeWeight: 0.70, // Receives steady fee allocation with primary capital preservation guarantee
    hedgingCostPct: 2.5, // Automated perpetual funding hedge cost
    inventorySkewExposure: 0.05,
    minAprPct: 8.5,
    projectedAprPct: 14.8,
    description: 'Automated delta-hedged market maker vault. Impermanent loss & inventory skew is 95% neutralized via basis synthetic futures hedging. Ideal for stable yield seekers.'
  },
  {
    id: 'grid',
    name: 'Dynamic Volatility Grid Vault',
    targetRisk: 'Moderate',
    capitalAllocationPct: 35,
    feeWeight: 1.15,
    hedgingCostPct: 1.0,
    inventorySkewExposure: 0.35,
    minAprPct: 14.0,
    projectedAprPct: 24.2,
    description: 'Algorithmic micro-limit grid maker. Places tight bid-ask spreads around moving TWAP with dynamic volatility bands. Captures peak maker rebates and retail flow.'
  },
  {
    id: 'junior',
    name: 'Junior Alpha Counterparty Vault',
    targetRisk: 'High',
    capitalAllocationPct: 20,
    feeWeight: 1.65,
    hedgingCostPct: 0.0,
    inventorySkewExposure: 0.85,
    minAprPct: 20.0,
    projectedAprPct: 38.5,
    description: 'First-loss absorption tranche taking non-toxic retail positions with maximum fee share and liquidation premium capture. Highest APY for risk-tolerant liquidity providers.'
  }
];
