import React, { useState, useEffect } from 'react';
import { MarketInfo, OrderBookData, TradeHistoryItem } from '../../types';
import { INITIAL_MARKETS, generateOrderBook } from '../../data/markets';
import { Position, executeTrade, calculatePositionPnl } from '../../utils/tradeEngine';
import { TradingChart } from './TradingChart';
import { OrderBook } from './OrderBook';
import { OrderForm } from './OrderForm';
import { PositionsTable } from './PositionsTable';
import { ChevronDown, Sparkles } from 'lucide-react';

interface TradeTerminalProps {
  userBalanceUsdc: number;
  onUpdateBalance: (newBalance: number) => void;
  positions: Position[];
  setPositions: React.Dispatch<React.SetStateAction<Position[]>>;
  tradeHistory: TradeHistoryItem[];
  setTradeHistory: React.Dispatch<React.SetStateAction<TradeHistoryItem[]>>;
}

export const TradeTerminal: React.FC<TradeTerminalProps> = ({
  userBalanceUsdc,
  onUpdateBalance,
  positions,
  setPositions,
  tradeHistory,
  setTradeHistory,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('ETH-PERP');
  const [markets, setMarkets] = useState<MarketInfo[]>(INITIAL_MARKETS);
  const [selectedLimitPrice, setSelectedLimitPrice] = useState<number | null>(null);

  const currentMarket = markets.find(m => m.symbol === selectedSymbol) || markets[0];
  const [orderBook, setOrderBook] = useState<OrderBookData>(() =>
    generateOrderBook(currentMarket.currentPrice, 0.8)
  );

  // Live orderbook & price ticker simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets(prev =>
        prev.map(m => {
          if (m.symbol === selectedSymbol) {
            // Tiny realistic micro fluctuation (±0.04%)
            const jitter = (Math.random() - 0.49) * (m.currentPrice * 0.0008);
            const newPrice = Number((m.currentPrice + jitter).toFixed(m.priceDecimals));
            return { ...m, currentPrice: newPrice };
          }
          return m;
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [selectedSymbol]);

  // Keep orderbook in sync with current price
  useEffect(() => {
    setOrderBook(generateOrderBook(currentMarket.currentPrice, 0.8));
  }, [currentMarket.currentPrice]);

  // Update open positions mark price and unrealized PnL
  useEffect(() => {
    setPositions(prev =>
      prev.map(pos => {
        if (pos.market === currentMarket.symbol) {
          const { pnlUsd, pnlPct } = calculatePositionPnl({
            side: pos.side,
            entryPrice: pos.entryPrice,
            currentPrice: currentMarket.currentPrice,
            sizeAsset: pos.sizeAsset,
            marginUsd: pos.marginUsd,
          });
          return {
            ...pos,
            currentPrice: currentMarket.currentPrice,
            unrealizedPnlUsd: pnlUsd,
            unrealizedPnlPct: pnlPct,
          };
        }
        return pos;
      })
    );
  }, [currentMarket.currentPrice, setPositions]);

  // Handle Trade Execution
  const handleExecuteTrade = (order: {
    side: 'long' | 'short';
    orderType: 'market' | 'limit';
    sizeUsd: number;
    leverage: number;
    limitPrice?: number;
  }) => {
    const exec = executeTrade({
      market: currentMarket.symbol,
      side: order.side,
      orderType: order.orderType,
      sizeUsd: order.sizeUsd,
      leverage: order.leverage,
      limitPrice: order.limitPrice,
      currentPrice: currentMarket.currentPrice,
      takerFeeBps: 1.1,
      toxicitySurchargeBps: 0.0,
    });

    // Deduct margin + fee from user balance
    const totalDeduction = exec.position.marginUsd + exec.feePaidUsd;
    onUpdateBalance(userBalanceUsdc - totalDeduction);

    // Add position
    setPositions(prev => [exec.position, ...prev]);

    // Record trade history
    const historyItem: TradeHistoryItem = {
      id: `trade-${Date.now()}`,
      timestamp: Date.now(),
      market: currentMarket.symbol,
      side: order.side,
      sizeUsd: order.sizeUsd,
      sizeAsset: exec.position.sizeAsset,
      price: exec.filledPrice,
      feePaidUsd: exec.feePaidUsd,
      lvrSavedUsd: exec.lvrSavedUsd,
    };
    setTradeHistory(prev => [historyItem, ...prev]);
  };

  // Handle Closing Position
  const handleClosePosition = (positionId: string) => {
    const pos = positions.find(p => p.id === positionId);
    if (!pos) return;

    // Return margin + realized PnL - closing fee
    const closingFee = pos.sizeUsd * (1.1 / 10000);
    const returnedCollateral = Math.max(0, pos.marginUsd + pos.unrealizedPnlUsd - closingFee);
    onUpdateBalance(userBalanceUsdc + returnedCollateral);

    // Remove position
    setPositions(prev => prev.filter(p => p.id !== positionId));

    // Record close in trade history
    const historyItem: TradeHistoryItem = {
      id: `trade-close-${Date.now()}`,
      timestamp: Date.now(),
      market: pos.market,
      side: pos.side === 'long' ? 'short' : 'long',
      sizeUsd: pos.sizeUsd,
      sizeAsset: pos.sizeAsset,
      price: pos.currentPrice,
      feePaidUsd: closingFee,
      lvrSavedUsd: pos.sizeUsd * (1.7 / 10000),
    };
    setTradeHistory(prev => [historyItem, ...prev]);
  };

  return (
    <div className="space-y-4">
      
      {/* Market Selector & Metrics Ribbon */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Market Dropdown / Switcher */}
          <div className="flex items-center gap-2">
            {markets.map(m => {
              const isSelected = m.symbol === selectedSymbol;
              return (
                <button
                  key={m.symbol}
                  onClick={() => setSelectedSymbol(m.symbol)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{m.symbol}</span>
                </button>
              );
            })}
          </div>

          {/* Market Telemetry Strip */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Mark Price</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                ${currentMarket.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-sans">24h Change</span>
              <span className={`font-bold ${currentMarket.change24hPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {currentMarket.change24hPct >= 0 ? '+' : ''}{currentMarket.change24hPct.toFixed(2)}%
              </span>
            </div>

            <div className="hidden sm:block">
              <span className="text-[10px] text-slate-400 block font-sans">24h Volume</span>
              <span className="text-slate-700 dark:text-slate-300">
                ${(currentMarket.volume24hUsd / 1_000_000).toFixed(1)}M
              </span>
            </div>

            <div className="hidden md:block">
              <span className="text-[10px] text-slate-400 block font-sans">1h Funding</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                +{(currentMarket.fundingRate1hPct * 100).toFixed(4)}%
              </span>
            </div>

            <div className="p-1.5 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Veritas Taker Fee: <strong>1.1 bps</strong> (vs HL: 2.8 bps)</span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Terminal Grid: Chart + OrderBook + OrderForm */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Chart Column (7 cols) */}
        <div className="lg:col-span-7 h-[420px]">
          <TradingChart
            symbol={currentMarket.symbol}
            currentPrice={currentMarket.currentPrice}
            change24hPct={currentMarket.change24hPct}
          />
        </div>

        {/* Order Book (2.5 cols) */}
        <div className="lg:col-span-2 h-[420px]">
          <OrderBook
            orderBook={orderBook}
            onSelectPrice={p => setSelectedLimitPrice(p)}
            priceDecimals={currentMarket.priceDecimals}
          />
        </div>

        {/* Order Form (2.5 cols) */}
        <div className="lg:col-span-3">
          <OrderForm
            market={currentMarket}
            availableUsdc={userBalanceUsdc}
            onExecuteTrade={handleExecuteTrade}
            selectedLimitPrice={selectedLimitPrice}
          />
        </div>

      </section>

      {/* Bottom Panel: Positions & History */}
      <section>
        <PositionsTable
          positions={positions}
          tradeHistory={tradeHistory}
          onClosePosition={handleClosePosition}
        />
      </section>

    </div>
  );
};
