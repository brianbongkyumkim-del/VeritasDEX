import { MarketInfo, OrderBookData, OrderBookLevel } from '../types';

export const INITIAL_MARKETS: MarketInfo[] = [
  {
    symbol: 'ETH-PERP',
    name: 'Ethereum Perpetual',
    baseAsset: 'ETH',
    currentPrice: 3245.80,
    change24hPct: +4.25,
    high24h: 3310.00,
    low24h: 3110.50,
    volume24hUsd: 845_200_000,
    openInterestUsd: 142_500_000,
    fundingRate1hPct: 0.0012, // 0.012% 8h equivalent
    maxLeverage: 50,
    priceDecimals: 2,
    minOrderSize: 10, // $10 minimum
  },
  {
    symbol: 'BTC-PERP',
    name: 'Bitcoin Perpetual',
    baseAsset: 'BTC',
    currentPrice: 88450.00,
    change24hPct: +2.18,
    high24h: 89900.00,
    low24h: 86200.00,
    volume24hUsd: 1_920_000_000,
    openInterestUsd: 410_000_000,
    fundingRate1hPct: 0.0009,
    maxLeverage: 50,
    priceDecimals: 1,
    minOrderSize: 20,
  },
  {
    symbol: 'SOL-PERP',
    name: 'Solana Perpetual',
    baseAsset: 'SOL',
    currentPrice: 204.60,
    change24hPct: +8.42,
    high24h: 212.00,
    low24h: 188.30,
    volume24hUsd: 620_400_000,
    openInterestUsd: 88_900_000,
    fundingRate1hPct: 0.0018,
    maxLeverage: 30,
    priceDecimals: 2,
    minOrderSize: 10,
  },
  {
    symbol: 'AVAX-PERP',
    name: 'Avalanche Perpetual',
    baseAsset: 'AVAX',
    currentPrice: 34.25,
    change24hPct: -1.15,
    high24h: 35.80,
    low24h: 33.40,
    volume24hUsd: 184_000_000,
    openInterestUsd: 28_400_000,
    fundingRate1hPct: 0.0008,
    maxLeverage: 25,
    priceDecimals: 2,
    minOrderSize: 10,
  }
];

export function generateOrderBook(midPrice: number, spreadBps: number = 0.8): OrderBookData {
  const spreadUsd = Number((midPrice * (spreadBps / 10000)).toFixed(2));
  const halfSpread = spreadUsd / 2;

  const bids: OrderBookLevel[] = [];
  const asks: OrderBookLevel[] = [];

  const stepSize = midPrice > 10000 ? 5 : midPrice > 100 ? 0.25 : 0.05;

  let bidTotal = 0;
  for (let i = 0; i < 7; i++) {
    const price = Number((midPrice - halfSpread - (i * stepSize)).toFixed(2));
    const size = Number((Math.random() * 8 + 1.5).toFixed(3));
    bidTotal += size;
    bids.push({
      price,
      size,
      total: Number(bidTotal.toFixed(3)),
      depthPct: Math.min(100, (bidTotal / 50) * 100),
    });
  }

  let askTotal = 0;
  for (let i = 0; i < 7; i++) {
    const price = Number((midPrice + halfSpread + (i * stepSize)).toFixed(2));
    const size = Number((Math.random() * 8 + 1.5).toFixed(3));
    askTotal += size;
    asks.push({
      price,
      size,
      total: Number(askTotal.toFixed(3)),
      depthPct: Math.min(100, (askTotal / 50) * 100),
    });
  }

  return {
    bids,
    asks,
    spreadUsd,
    spreadBps,
    midPrice,
  };
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function generateHistoricalCandles(currentPrice: number, count: number = 32): Candle[] {
  const candles: Candle[] = [];
  let price = currentPrice * 0.96;
  const now = Date.now();
  const stepMs = 5 * 60 * 1000; // 5-minute candles

  for (let i = count; i >= 0; i--) {
    const timeDate = new Date(now - i * stepMs);
    const timeStr = timeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const delta = (Math.random() - 0.47) * (currentPrice * 0.008);
    const open = price;
    const close = i === 0 ? currentPrice : price + delta;
    const high = Math.max(open, close) + Math.random() * (currentPrice * 0.003);
    const low = Math.min(open, close) - Math.random() * (currentPrice * 0.003);
    const volume = Math.floor(Math.random() * 1500 + 400);

    candles.push({
      time: timeStr,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    price = close;
  }

  return candles;
}
