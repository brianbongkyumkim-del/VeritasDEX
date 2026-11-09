import React, { useState } from 'react';
import { MarketInfo } from '../../types';
import { calculateLiquidationPrice } from '../../utils/tradeEngine';
import { ArrowUpRight, ArrowDownRight, Zap, Info } from 'lucide-react';

interface OrderFormProps {
  market: MarketInfo;
  availableUsdc: number;
  onExecuteTrade: (order: {
    side: 'long' | 'short';
    orderType: 'market' | 'limit';
    sizeUsd: number;
    leverage: number;
    limitPrice?: number;
  }) => void;
  selectedLimitPrice: number | null;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  market,
  availableUsdc,
  onExecuteTrade,
  selectedLimitPrice,
}) => {
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [leverage, setLeverage] = useState<number>(10);
  const [sizeUsdInput, setSizeUsdInput] = useState<string>('2000');
  const [limitPriceInput, setLimitPriceInput] = useState<string>(
    selectedLimitPrice ? selectedLimitPrice.toString() : market.currentPrice.toString()
  );

  // Sync selected limit price when user clicks orderbook
  React.useEffect(() => {
    if (selectedLimitPrice) {
      setLimitPriceInput(selectedLimitPrice.toString());
      setOrderType('limit');
    }
  }, [selectedLimitPrice]);

  const sizeUsd = Math.max(10, Number(sizeUsdInput) || 0);
  const executionPrice = orderType === 'limit' && Number(limitPriceInput) ? Number(limitPriceInput) : market.currentPrice;
  const assetSize = executionPrice > 0 ? (sizeUsd / executionPrice).toFixed(4) : '0';
  const marginRequired = sizeUsd / leverage;
  const estimatedLiqPrice = calculateLiquidationPrice(executionPrice, side, leverage);

  // Fee calculation: Veritas 1.1 bps vs Hyperliquid 2.8 bps
  const veritasFeeUsd = sizeUsd * (1.1 / 10000);
  const hyperliquidFeeUsd = sizeUsd * (2.8 / 10000);
  const savingsUsd = Math.max(0, hyperliquidFeeUsd - veritasFeeUsd);

  const handlePercentageSelect = (pct: number) => {
    const maxMargin = Math.max(10, availableUsdc * pct);
    const calculatedSize = Math.floor(maxMargin * leverage);
    setSizeUsdInput(calculatedSize.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sizeUsd <= 0) return;
    if (marginRequired > availableUsdc) {
      alert(`Insufficient margin! Required: $${marginRequired.toFixed(2)}, Available: $${availableUsdc.toFixed(2)}`);
      return;
    }

    onExecuteTrade({
      side,
      orderType,
      sizeUsd,
      leverage,
      limitPrice: orderType === 'limit' ? Number(limitPriceInput) : undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-4"
    >
      
      {/* Side Toggle: Long vs Short */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          type="button"
          onClick={() => setSide('long')}
          className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
            side === 'long'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Long / Buy</span>
        </button>

        <button
          type="button"
          onClick={() => setSide('short')}
          className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
            side === 'short'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span>Short / Sell</span>
        </button>
      </div>

      {/* Order Type Toggle: Market vs Limit */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOrderType('market')}
            className={`font-semibold cursor-pointer pb-0.5 border-b-2 transition-colors ${
              orderType === 'market'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Market
          </button>
          <button
            type="button"
            onClick={() => setOrderType('limit')}
            className={`font-semibold cursor-pointer pb-0.5 border-b-2 transition-colors ${
              orderType === 'limit'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Limit
          </button>
        </div>

        <span className="text-[11px] text-slate-500">
          Avail: <strong className="font-mono text-slate-800 dark:text-slate-200">${availableUsdc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </span>
      </div>

      {/* Limit Price Input if orderType === 'limit' */}
      {orderType === 'limit' && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <label htmlFor="limit-price-input">Limit Price (USDC)</label>
            <span className="font-mono">Mid: ${market.currentPrice.toFixed(2)}</span>
          </div>
          <input
            id="limit-price-input"
            type="number"
            step="0.1"
            value={limitPriceInput}
            onChange={e => setLimitPriceInput(e.target.value)}
            className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      )}

      {/* Position Size Input */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
          <label htmlFor="order-size-input">Order Size</label>
          <span className="font-mono">{assetSize} {market.baseAsset}</span>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">$</span>
          <input
            id="order-size-input"
            type="number"
            min="10"
            max="1000000"
            step="100"
            value={sizeUsdInput}
            onChange={e => setSizeUsdInput(e.target.value)}
            className="w-full pl-7 pr-16 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="absolute right-3 top-2 text-slate-400 font-mono text-xs">USDC</span>
        </div>

        {/* Quick Percentage Chips */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {[0.25, 0.50, 0.75, 1.0].map(pct => (
            <button
              key={pct}
              type="button"
              onClick={() => handlePercentageSelect(pct)}
              className="py-1 text-[11px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded cursor-pointer transition-colors"
            >
              {pct * 100}%
            </button>
          ))}
        </div>
      </div>

      {/* Leverage Slider */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">Leverage</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{leverage}x</span>
        </div>
        <input
          type="range"
          min="1"
          max={market.maxLeverage}
          step="1"
          value={leverage}
          onChange={e => setLeverage(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>1x</span>
          <span>10x</span>
          <span>25x</span>
          <span>{market.maxLeverage}x</span>
        </div>
      </div>

      {/* Order Summary & Fee Savings Breakdown */}
      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500">Margin Required:</span>
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">${marginRequired.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Est. Liquidation Price:</span>
          <span className="font-mono font-bold text-amber-600 dark:text-amber-400">${estimatedLiqPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700/60">
          <span className="text-slate-500">Veritas Fee (1.1 bps):</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">${veritasFeeUsd.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-400">Hyperliquid Fee (2.8 bps):</span>
          <span className="font-mono line-through text-slate-400">${hyperliquidFeeUsd.toFixed(2)}</span>
        </div>
        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold text-right">
          You save ${savingsUsd.toFixed(2)} on this trade!
        </div>
      </div>

      {/* Primary Submit Button */}
      <button
        type="submit"
        className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm text-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
          side === 'long'
            ? 'bg-emerald-600 hover:bg-emerald-700'
            : 'bg-rose-600 hover:bg-rose-700'
        }`}
      >
        <Zap className="w-4 h-4" />
        <span>
          Execute {side === 'long' ? 'Long' : 'Short'} {market.symbol}
        </span>
      </button>

    </form>
  );
};
