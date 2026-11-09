export type ActiveTab = 'trade' | 'pools' | 'oracle' | 'simulator' | 'comparison' | 'whitepaper' | 'digitalx' | 'korbit';

export interface MarketInfo {
  symbol: string;
  name: string;
  baseAsset: string;
  currentPrice: number;
  change24hPct: number;
  high24h: number;
  low24h: number;
  volume24hUsd: number;
  openInterestUsd: number;
  fundingRate1hPct: number;
  maxLeverage: number;
  priceDecimals: number;
  minOrderSize: number;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
  depthPct: number;
}

export interface OrderBookData {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spreadUsd: number;
  spreadBps: number;
  midPrice: number;
}

export interface TradeHistoryItem {
  id: string;
  timestamp: number;
  market: string;
  side: 'long' | 'short';
  sizeUsd: number;
  sizeAsset: number;
  price: number;
  feePaidUsd: number;
  lvrSavedUsd: number;
}

export interface UserPoolDeposit {
  trancheId: 'senior' | 'grid' | 'junior';
  shares: number;
  depositedUsdc: number;
  currentValueUsdc: number;
  accruedYieldUsdc: number;
  aprPct: number;
  depositTimestamp: number;
}

export interface ToxicityOracleTelemetry {
  externalCexIndexPrice: number;
  internalMidPrice: number;
  priceDivergencePct: number;
  toxicityScore: number; // 0.0 (benign) to 1.0 (highly toxic)
  spreadMultiplier: number;
  veritasEffectiveSpreadBps: number;
  hyperliquidFixedSpreadBps: number;
  totalLvrDollarsSaved: number;
  isShockActive: boolean;
}

export interface ComparisonDimension {
  id: string;
  title: string;
  hyperliquidApproach: {
    label: string;
    description: string;
    vulnerability: string;
  };
  veritasApproach: {
    label: string;
    description: string;
    advantage: string;
  };
  metricImpact: string;
}

export interface SimulationPreset {
  id: string;
  name: string;
  description: string;
  dailyVolumeUsd: number;
  takerFeeBps: number;
  totalLpTvlUsd: number;
  marketVolatilityPct: number;
  toxicFlowPct: number;
  lvrProtectionEfficiency: number;
}
