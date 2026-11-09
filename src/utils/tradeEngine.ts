/**
 * Core trading calculations: margin, liquidation price, PnL, and fees.
 * Decoupled logic for automated unit testing.
 */

export interface Position {
  id: string;
  market: string;
  side: 'long' | 'short';
  sizeUsd: number;
  sizeAsset: number;
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  marginUsd: number;
  liquidationPrice: number;
  unrealizedPnlUsd: number;
  unrealizedPnlPct: number;
  openTimestamp: number;
}

export interface TradeOrderRequest {
  market: string;
  side: 'long' | 'short';
  orderType: 'market' | 'limit';
  sizeUsd: number;
  leverage: number;
  limitPrice?: number;
  currentPrice: number;
  takerFeeBps: number;
  toxicitySurchargeBps: number;
}

export interface TradeExecutionResult {
  filledPrice: number;
  position: Position;
  feePaidUsd: number;
  lvrSavedUsd: number;
}

/**
 * Calculates liquidation price for a perpetual position.
 * Maintenance margin rate is typically 2.5% (0.025) for 50x max leverage.
 */
export function calculateLiquidationPrice(
  entryPrice: number,
  side: 'long' | 'short',
  leverage: number,
  maintenanceMarginRate: number = 0.025
): number {
  if (leverage <= 1) {
    return side === 'long' ? 0 : entryPrice * (1 + 1);
  }

  const initialMarginRate = 1 / leverage;
  const maxLossFraction = initialMarginRate - maintenanceMarginRate;

  if (side === 'long') {
    return Number((entryPrice * (1 - maxLossFraction)).toFixed(2));
  } else {
    return Number((entryPrice * (1 + maxLossFraction)).toFixed(2));
  }
}

/**
 * Calculates unrealized PnL for an open position.
 */
export function calculatePositionPnl(
  position: Pick<Position, 'side' | 'entryPrice' | 'currentPrice' | 'sizeAsset' | 'marginUsd'>
): { pnlUsd: number; pnlPct: number } {
  const priceDelta = position.side === 'long'
    ? position.currentPrice - position.entryPrice
    : position.entryPrice - position.currentPrice;

  const pnlUsd = Number((priceDelta * position.sizeAsset).toFixed(2));
  const pnlPct = position.marginUsd > 0
    ? Number(((pnlUsd / position.marginUsd) * 100).toFixed(2))
    : 0;

  return { pnlUsd, pnlPct };
}

/**
 * Executes a simulated trade with Veritas cost-plus fee & LVR capture.
 */
export function executeTrade(req: TradeOrderRequest): TradeExecutionResult {
  const filledPrice = req.orderType === 'limit' && req.limitPrice ? req.limitPrice : req.currentPrice;
  const sizeAsset = Number((req.sizeUsd / filledPrice).toFixed(6));
  const marginUsd = Number((req.sizeUsd / req.leverage).toFixed(2));
  const liquidationPrice = calculateLiquidationPrice(filledPrice, req.side, req.leverage);

  const totalFeeBps = req.takerFeeBps + req.toxicitySurchargeBps;
  const feePaidUsd = Number((req.sizeUsd * (totalFeeBps / 10000)).toFixed(2));

  // Hyperliquid fee baseline would have been 2.8 bps flat
  const hyperliquidFeeUsd = req.sizeUsd * (2.8 / 10000);
  const lvrSavedUsd = Number(Math.max(0, hyperliquidFeeUsd - feePaidUsd).toFixed(2));

  const position: Position = {
    id: `pos-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    market: req.market,
    side: req.side,
    sizeUsd: req.sizeUsd,
    sizeAsset,
    entryPrice: filledPrice,
    currentPrice: filledPrice,
    leverage: req.leverage,
    marginUsd,
    liquidationPrice,
    unrealizedPnlUsd: 0,
    unrealizedPnlPct: 0,
    openTimestamp: Date.now(),
  };

  return {
    filledPrice,
    position,
    feePaidUsd,
    lvrSavedUsd,
  };
}

/**
 * Calculates pool share token minting/redemption.
 */
export function calculatePoolDeposit(
  depositUsdc: number,
  poolTotalLiquidityUsdc: number,
  poolTotalSupplyShares: number
): { sharesMinted: number; newSharePrice: number } {
  if (poolTotalLiquidityUsdc <= 0 || poolTotalSupplyShares <= 0) {
    return { sharesMinted: depositUsdc, newSharePrice: 1.0 };
  }

  const sharePrice = poolTotalLiquidityUsdc / poolTotalSupplyShares;
  const sharesMinted = Number((depositUsdc / sharePrice).toFixed(4));
  return { sharesMinted, newSharePrice: sharePrice };
}

export function calculatePoolWithdrawal(
  sharesToBurn: number,
  poolTotalLiquidityUsdc: number,
  poolTotalSupplyShares: number
): { usdcReceived: number } {
  if (poolTotalSupplyShares <= 0) return { usdcReceived: 0 };
  const sharePrice = poolTotalLiquidityUsdc / poolTotalSupplyShares;
  const usdcReceived = Number((sharesToBurn * sharePrice).toFixed(2));
  return { usdcReceived };
}
