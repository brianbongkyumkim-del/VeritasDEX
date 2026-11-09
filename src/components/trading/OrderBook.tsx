import React from 'react';
import { OrderBookData } from '../../types';

interface OrderBookProps {
  orderBook: OrderBookData;
  onSelectPrice: (price: number) => void;
  priceDecimals: number;
}

export const OrderBook: React.FC<OrderBookProps> = ({
  orderBook,
  onSelectPrice,
  priceDecimals,
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
          Live Order Book
        </h3>
        <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
          Spread: {orderBook.spreadBps.toFixed(1)} bps (${orderBook.spreadUsd.toFixed(2)})
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 px-3 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/60">
        <span>Price (USDC)</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Sell Orders) - Red */}
      <div className="flex-1 flex flex-col justify-end overflow-hidden p-1 space-y-0.5">
        {[...orderBook.asks].reverse().map((ask, i) => (
          <div
            key={i}
            onClick={() => onSelectPrice(ask.price)}
            className="group relative grid grid-cols-3 px-2 py-0.5 text-xs font-mono cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded"
          >
            {/* Depth Bar Background */}
            <div
              style={{ width: `${ask.depthPct}%` }}
              className="absolute right-0 top-0 bottom-0 bg-rose-500/10 dark:bg-rose-500/20 rounded pointer-events-none transition-all duration-150"
            />
            <span className="relative text-rose-600 dark:text-rose-400 font-medium">
              {ask.price.toFixed(priceDecimals)}
            </span>
            <span className="relative text-right text-slate-600 dark:text-slate-300">
              {ask.size.toFixed(3)}
            </span>
            <span className="relative text-right text-slate-400 dark:text-slate-500">
              {ask.total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Mid Market Spread Bar */}
      <div className="py-1.5 px-3 bg-slate-50 dark:bg-slate-800/60 border-y border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
          <span>${orderBook.midPrice.toFixed(priceDecimals)}</span>
          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Mid</span>
        </div>
        <div className="text-[10px] text-slate-500">
          HL: 2.8 bps vs Veritas: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{orderBook.spreadBps} bps</strong>
        </div>
      </div>

      {/* Bids (Buy Orders) - Green */}
      <div className="flex-1 overflow-hidden p-1 space-y-0.5">
        {orderBook.bids.map((bid, i) => (
          <div
            key={i}
            onClick={() => onSelectPrice(bid.price)}
            className="group relative grid grid-cols-3 px-2 py-0.5 text-xs font-mono cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded"
          >
            {/* Depth Bar Background */}
            <div
              style={{ width: `${bid.depthPct}%` }}
              className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 dark:bg-emerald-500/20 rounded pointer-events-none transition-all duration-150"
            />
            <span className="relative text-emerald-600 dark:text-emerald-400 font-medium">
              {bid.price.toFixed(priceDecimals)}
            </span>
            <span className="relative text-right text-slate-600 dark:text-slate-300">
              {bid.size.toFixed(3)}
            </span>
            <span className="relative text-right text-slate-400 dark:text-slate-500">
              {bid.total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};
