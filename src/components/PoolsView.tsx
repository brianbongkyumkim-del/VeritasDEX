import React, { useState } from 'react';
import { DEFAULT_TRANCHES } from '../utils/economics';
import { Shield, Activity, Flame, Eye, Lock, ArrowUpRight, Code, Calculator } from 'lucide-react';

export const PoolsView: React.FC = () => {
  const [selectedTrancheId, setSelectedTrancheId] = useState<'senior' | 'grid' | 'junior'>('senior');
  const [depositAmount, setDepositAmount] = useState<number>(25000);
  const [depositDays, setDepositDays] = useState<number>(365);
  const [showCodePreview, setShowCodePreview] = useState<boolean>(false);

  const selectedTranche = DEFAULT_TRANCHES.find(t => t.id === selectedTrancheId) || DEFAULT_TRANCHES[0];

  // Calculate projected return
  const annualizedRate = selectedTranche.projectedAprPct / 100;
  const timeFactor = depositDays / 365;
  const projectedEarnings = depositAmount * annualizedRate * timeFactor;
  const hlpProjectedEarnings = depositAmount * 0.125 * timeFactor; // Hyperliquid HLP typical ~12.5%

  const STRATEGY_CODE: Record<string, string> = {
    senior: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

/// @notice Senior Delta-Neutral Vault: 100% On-Chain Verifiable Hedging Logic
contract SeniorDeltaNeutralVault is IVeritasVault {
    using FixedPointMath for uint256;

    uint256 public constant MAX_INVENTORY_SKEW_BPS = 50; // Max 0.5% unhedged delta
    uint256 public constant PROTOCOL_FEE_MULTIPLIER = 7000; // 0.70x baseline fee share

    function rebalanceInventory(int256 netExposureUsd) external onlyRebalancer {
        require(abs(netExposureUsd) > SKEW_TOLERANCE, "Skew within bounds");
        
        // Execute offsetting synthetic basis short/long on internal high-speed book
        if (netExposureUsd > 0) {
            orderEngine.placeHedgeOrder(Side.SHORT, uint256(netExposureUsd));
        } else {
            orderEngine.placeHedgeOrder(Side.LONG, uint256(-netExposureUsd));
        }
        
        emit InventoryRebalanced(netExposureUsd, block.timestamp);
    }

    function calculateLpShareValue() external view returns (uint256) {
        // Transparent asset value = Collateral + Hedging PnL + Accumulated Fee Yield
        return (totalCollateral + hedgeEngine.unrealizedPnL() + accumulatedFeePool)
            .divWad(totalSupply);
    }
}`,
    grid: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

/// @notice Dynamic Volatility Grid Vault: Automated Range-Bound Micro-Maker
contract VolatilityGridVault is IVeritasVault {
    uint256 public constant GRID_LEVELS = 8;
    uint256 public constant PROTOCOL_FEE_MULTIPLIER = 11500; // 1.15x fee weight

    function computeGridOrders(uint256 twapMid, uint256 sigmaInstant) 
        external 
        view 
        returns (LimitOrder[] memory bids, LimitOrder[] memory asks) 
    {
        // Spread dynamically expands with volatility oracle sigma
        uint256 dynamicSpread = BASE_SPREAD + (sigmaInstant * VOLATILITY_COEFFICIENT);
        
        bids = new LimitOrder[](GRID_LEVELS);
        asks = new LimitOrder[](GRID_LEVELS);
        
        for (uint256 i = 0; i < GRID_LEVELS; i++) {
            uint256 delta = dynamicSpread * (i + 1);
            bids[i] = LimitOrder(twapMid - delta, calculateLayerLiquidity(i));
            asks[i] = LimitOrder(twapMid + delta, calculateLayerLiquidity(i));
        }
    }
}`,
    junior: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

/// @notice Junior Alpha Vault: High-Yield Counterparty & Liquidation Harvester
contract JuniorAlphaVault is IVeritasVault {
    uint256 public constant PROTOCOL_FEE_MULTIPLIER = 16500; // 1.65x fee share
    uint256 public constant LIQUIDATION_REWARD_BPS = 2000; // 20% of protocol liquidation bonus

    function absorbLiquidation(uint256 positionId, address liquidator) 
        external 
        onlyClearingEngine 
        returns (uint256 liquidationYield) 
    {
        Position memory pos = clearingHouse.getPosition(positionId);
        // Junior tranche absorbs remaining margin deficit and receives discounted collateral
        liquidationYield = (pos.notional * LIQUIDATION_REWARD_BPS) / 10000;
        accumulatedAlphaPool += liquidationYield;
        
        emit AlphaLiquidationHarvested(positionId, liquidationYield);
    }
}`
  };

  return (
    <div className="space-y-10">
      
      {/* Overview Intro */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span>User-Owned Liquidity Architecture</span>
          <span aria-hidden="true">·</span>
          <span>Risk-Segregated Tranches</span>
          <span aria-hidden="true">·</span>
          <span>Open-Source Strategy Verification</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Transparent User-Owned Liquidity (TUOL)
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          On Hyperliquid, depositors must pool funds into <strong>HLP</strong>, an opaque monolithic black box where market-making strategies, risk thresholds, and inventory drawdowns are dictated by a closed algorithm. Veritas replaces this with <strong>three distinct, auditable tranches</strong>: users select their risk tolerance, retain custody, and inspect every line of on-chain strategy code.
        </p>
      </section>

      {/* Tranche Selector Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEFAULT_TRANCHES.map(tranche => {
          const isSelected = selectedTrancheId === tranche.id;
          
          let icon = <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
          if (tranche.id === 'grid') {
            icon = <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
          } else if (tranche.id === 'junior') {
            icon = <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
          }

          return (
            <div
              key={tranche.id}
              onClick={() => setSelectedTrancheId(tranche.id)}
              className={`p-6 rounded-xl border transition-all cursor-pointer space-y-4 ${
                isSelected
                  ? 'border-emerald-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {icon}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {tranche.name.split(' ')[0]} Tranche
                    </h2>
                    <span className="text-xs text-slate-500">Risk Profile: {tranche.targetRisk}</span>
                  </div>
                </div>

                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  tranche.targetRisk === 'Low'
                    ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40'
                    : tranche.targetRisk === 'Moderate'
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40'
                }`}>
                  {tranche.targetRisk}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-500 dark:text-slate-400">Target Projected Yield</div>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                  {tranche.projectedAprPct}% APR
                </div>
                <div className="text-[11px] text-slate-500">Floor: {tranche.minAprPct}% APR · Multiplier: {tranche.feeWeight}x</div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-[4rem]">
                {tranche.description}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Protocol Allocation</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{tranche.capitalAllocationPct}% TVL target</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Interactive Deposit & Returns Calculator */}
      <section className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Deposit Simulator: {selectedTranche.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculate your projected returns vs Hyperliquid HLP over your preferred investment timeframe.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCodePreview(!showCodePreview)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showCodePreview ? 'Hide On-Chain Code' : 'View Smart Contract Logic'}</span>
          </button>
        </div>

        {/* Inputs & Outputs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Inputs (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className="space-y-1.5">
              <label htmlFor="deposit-amount-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Deposit Principal (USDC)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">$</span>
                <input
                  id="deposit-amount-input"
                  type="number"
                  min="1000"
                  max="1000000"
                  step="1000"
                  value={depositAmount}
                  onChange={e => setDepositAmount(Math.max(100, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                {[5000, 25000, 100000, 250000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setDepositAmount(amt)}
                    className="px-2 py-0.5 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded hover:bg-slate-200 cursor-pointer"
                  >
                    ${amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="duration-slider" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Deposit Duration: <span className="font-mono text-emerald-600 dark:text-emerald-400">{depositDays} Days</span>
              </label>
              <input
                id="duration-slider"
                type="range"
                min="30"
                max="365"
                step="30"
                value={depositDays}
                onChange={e => setDepositDays(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>30 Days</span>
                <span>90 Days</span>
                <span>180 Days</span>
                <span>365 Days (1 Yr)</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div className="font-semibold text-slate-900 dark:text-slate-200">
                Key Tranche Guarantees:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li>Zero lockup: Instant on-chain redemption without queue throttling.</li>
                <li>Isolated counterparty risk: Losses in Junior tranche never impair Senior principal.</li>
                <li>100% on-chain accounting with continuous fee auto-compounding.</li>
              </ul>
            </div>

          </div>

          {/* Projected Outcome Card (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Projected Outcome Summary
              </span>
              <span className="text-xs font-mono text-slate-500">
                {depositDays} Days Horizon
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-xs text-slate-500">Veritas {selectedTranche.name.split(' ')[0]} Yield</div>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                  +${projectedEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-500">
                  Total Balance: ${(depositAmount + projectedEarnings).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-xs text-slate-500">Hyperliquid HLP Baseline Yield</div>
                <div className="text-2xl font-extrabold text-slate-700 dark:text-slate-300 font-mono tabular-nums">
                  +${hlpProjectedEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-500">
                  Total Balance: ${(depositAmount + hlpProjectedEarnings).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/30 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-700 dark:text-emerald-300 shrink-0" />
                <span>
                  Net Alpha Advantage over Hyperliquid: <strong>+${(projectedEarnings - hlpProjectedEarnings).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                </span>
              </div>
              <span className="font-mono font-bold">
                +{(((projectedEarnings - hlpProjectedEarnings) / depositAmount) * 100).toFixed(1)}% extra ROI
              </span>
            </div>

          </div>

        </div>

        {/* Expandable On-Chain Smart Contract Logic Preview */}
        {showCodePreview && (
          <div className="mt-6 space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Code className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>On-Chain Verifiable Architecture: {selectedTranche.name}</span>
              </div>
              <span className="text-[11px] text-slate-400">Audited Reference Implementation</span>
            </div>
            <pre className="p-4 rounded-lg bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
              <code>{STRATEGY_CODE[selectedTrancheId]}</code>
            </pre>
          </div>
        )}

      </section>

      {/* Transparency Guarantee Table */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Transparency Guarantees: Veritas TUOL vs Hyperliquid HLP
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Feature Dimension</th>
                <th className="py-3 px-4">Hyperliquid HLP</th>
                <th className="py-3 px-4">Veritas TUOL Tranches</th>
                <th className="py-3 px-4">User Benefit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Strategy Code Visibility</td>
                <td className="py-3 px-4 text-amber-600 dark:text-amber-400">Proprietary / Off-Chain Execution</td>
                <td className="py-3 px-4 font-medium text-emerald-600 dark:text-emerald-400">100% Open-Source Solidity/ZK</td>
                <td className="py-3 px-4 text-slate-500">Zero hidden frontrunning or strategy decay</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Risk Tranche Segregation</td>
                <td className="py-3 px-4 text-amber-600 dark:text-amber-400">Single Monolithic Risk Pool</td>
                <td className="py-3 px-4 font-medium text-emerald-600 dark:text-emerald-400">Senior, Grid, Junior Buckets</td>
                <td className="py-3 px-4 text-slate-500">Choice between 0-risk delta-hedged or high alpha</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Real-Time Inventory Skew</td>
                <td className="py-3 px-4 text-amber-600 dark:text-amber-400">Aggregated periodic updates</td>
                <td className="py-3 px-4 font-medium text-emerald-600 dark:text-emerald-400">Per-block public telemetry</td>
                <td className="py-3 px-4 text-slate-500">Exact insight into net directional risk</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Redemption Throttling</td>
                <td className="py-3 px-4 text-amber-600 dark:text-amber-400">Epoch queues during market stress</td>
                <td className="py-3 px-4 font-medium text-emerald-600 dark:text-emerald-400">Instant per-block withdrawals</td>
                <td className="py-3 px-4 text-slate-500">Full liquidity sovereignty at all times</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
