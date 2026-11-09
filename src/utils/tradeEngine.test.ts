import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLiquidationPrice,
  calculatePositionPnl,
  executeTrade,
  calculatePoolDeposit,
  calculatePoolWithdrawal,
  TradeOrderRequest
} from './tradeEngine';

test('calculateLiquidationPrice computes correct liquidation threshold for long and short', () => {
  const entryPrice = 3000; // ETH at $3000
  const leverage = 10; // 10x leverage (10% margin, 2.5% maint margin -> 7.5% drop = $225)
  
  const longLiq = calculateLiquidationPrice(entryPrice, 'long', leverage);
  assert.equal(longLiq, 2775); // 3000 * (1 - (0.1 - 0.025)) = 2775

  const shortLiq = calculateLiquidationPrice(entryPrice, 'short', leverage);
  assert.equal(shortLiq, 3225); // 3000 * (1 + (0.1 - 0.025)) = 3225
});

test('calculatePositionPnl computes accurate unrealized PnL', () => {
  const position = {
    side: 'long' as const,
    entryPrice: 3000,
    currentPrice: 3150, // +$150 price increase (+5%)
    sizeAsset: 2.0, // 2 ETH ($6000 size)
    marginUsd: 600, // 10x leverage
  };

  const { pnlUsd, pnlPct } = calculatePositionPnl(position);
  assert.equal(pnlUsd, 300); // 150 * 2 = 300
  assert.equal(pnlPct, 50); // 300 / 600 = +50% ROI
});

test('executeTrade creates open position with fee savings vs Hyperliquid', () => {
  const req: TradeOrderRequest = {
    market: 'ETH-PERP',
    side: 'long',
    orderType: 'market',
    sizeUsd: 10000,
    leverage: 10,
    currentPrice: 3000,
    takerFeeBps: 1.1,
    toxicitySurchargeBps: 0.0,
  };

  const result = executeTrade(req);
  assert.equal(result.filledPrice, 3000);
  assert.equal(result.position.marginUsd, 1000);
  assert.equal(result.feePaidUsd, 1.1); // 1.1 bps of $10,000 = $1.10
  assert.equal(result.lvrSavedUsd, 1.7); // Hyperliquid 2.8 bps = $2.80; saved = $1.70
});

test('calculatePoolDeposit and calculatePoolWithdrawal maintain invariant', () => {
  const deposit = calculatePoolDeposit(1000, 100_000, 80_000);
  // Share price = 100000 / 80000 = 1.25
  // Shares minted = 1000 / 1.25 = 800
  assert.equal(deposit.newSharePrice, 1.25);
  assert.equal(deposit.sharesMinted, 800);

  const withdraw = calculatePoolWithdrawal(800, 101_000, 80_800);
  // 800 shares * 1.25 = 1000
  assert.equal(withdraw.usdcReceived, 1000);
});
