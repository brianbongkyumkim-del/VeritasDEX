import React, { useState } from 'react';
import { Position } from '../../utils/tradeEngine';
import { TradeHistoryItem } from '../../types';
import { X, ArrowUpRight, ArrowDownRight, History, Layers } from 'lucide-react';

interface PositionsTableProps {
  positions: Position[];
  tradeHistory: TradeHistoryItem[];
  onClosePosition: (positionId: string) => void;
}

export const PositionsTable: React.FC<PositionsTableProps> = ({
  positions,
  tradeHistory,
  onClosePosition,
}) => {
  const [activeTab, setActiveTab] = useState<'positions' | 'history'>('positions');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
      
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('positions')}
            className={`flex items-center gap-1.5 pb-1 cursor-pointer transition-colors ${
              activeTab === 'positions'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Open Positions ({positions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 pb-1 cursor-pointer transition-colors ${
              activeTab === 'history'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Trade History ({tradeHistory.length})</span>
          </button>
        </div>
      </div>

      {/* Positions Table */}
      {activeTab === 'positions' && (
        <div className="overflow-x-auto">
          {positions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No open positions. Select a market and execute a Long or Short to trade with sub-basis-point fees!
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-500 border-b border-slate-100 dark:border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-4 font-sans">Market</th>
                  <th className="py-2.5 px-4 font-sans">Side</th>
                  <th className="py-2.5 px-4 text-right">Size (USD)</th>
                  <th className="py-2.5 px-4 text-right">Entry Price</th>
                  <th className="py-2.5 px-4 text-right">Mark Price</th>
                  <th className="py-2.5 px-4 text-right">Liq. Price</th>
                  <th className="py-2.5 px-4 text-right">Margin</th>
                  <th className="py-2.5 px-4 text-right">Unrealized PnL</th>
                  <th className="py-2.5 px-4 text-center font-sans">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {positions.map(pos => {
                  const isProfit = pos.unrealizedPnlUsd >= 0;
                  return (
                    <tr key={pos.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-slate-100">
                        {pos.market}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                          pos.side === 'long' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {pos.side === 'long' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {pos.side.toUpperCase()} {pos.leverage}x
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-800 dark:text-slate-200">
                        ${pos.sizeUsd.toLocaleString()}
                        <div className="text-[10px] text-slate-400">{pos.sizeAsset}</div>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                        ${pos.entryPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                        ${pos.currentPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right text-amber-600 dark:text-amber-400">
                        ${pos.liquidationPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                        ${pos.marginUsd.toFixed(2)}
                      </td>
                      <td className={`py-3 px-4 text-right font-bold ${
                        isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {isProfit ? '+' : ''}${pos.unrealizedPnlUsd.toFixed(2)}
                        <div className="text-[10px]">
                          ({isProfit ? '+' : ''}{pos.unrealizedPnlPct.toFixed(2)}%)
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onClosePosition(pos.id)}
                          className="px-2.5 py-1 text-xs font-sans font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-colors"
                        >
                          Close Market
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Trade History Table */}
      {activeTab === 'history' && (
        <div className="overflow-x-auto">
          {tradeHistory.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No trades executed yet.
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-500 border-b border-slate-100 dark:border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-4 font-sans">Time</th>
                  <th className="py-2.5 px-4 font-sans">Market</th>
                  <th className="py-2.5 px-4 font-sans">Side</th>
                  <th className="py-2.5 px-4 text-right">Size</th>
                  <th className="py-2.5 px-4 text-right">Price</th>
                  <th className="py-2.5 px-4 text-right">Fee Paid</th>
                  <th className="py-2.5 px-4 text-right">LVR Saved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tradeHistory.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 text-slate-400">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-4 font-sans font-bold text-slate-900 dark:text-slate-100">
                      {item.market}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`font-bold ${item.side === 'long' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {item.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-800 dark:text-slate-200">
                      ${item.sizeUsd.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-600 dark:text-slate-400">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                      ${item.feePaidUsd.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      +${item.lvrSavedUsd.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
};
