import React, { useState, useMemo } from 'react';
import { SIMULATION_PRESETS } from '../data/protocolComparison';
import { SimulationParams, calculateDexEconomics } from '../utils/economics';
import { RefreshCw, TrendingUp, DollarSign, ShieldAlert, Sparkles, Sliders } from 'lucide-react';

export const SimulatorView: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('hl_current');

  const [params, setParams] = useState<SimulationParams>({
    dailyVolumeUsd: 1_500_000_000,
    takerFeeBps: 1.2,
    totalLpTvlUsd: 500_000_000,
    marketVolatilityPct: 65,
    toxicFlowPct: 22,
    lvrProtectionEfficiency: 85,
  });

  const handleApplyPreset = (presetId: string) => {
    const preset = SIMULATION_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPresetId(presetId);
      setParams({
        dailyVolumeUsd: preset.dailyVolumeUsd,
        takerFeeBps: preset.takerFeeBps,
        totalLpTvlUsd: preset.totalLpTvlUsd,
        marketVolatilityPct: preset.marketVolatilityPct,
        toxicFlowPct: preset.toxicFlowPct,
        lvrProtectionEfficiency: preset.lvrProtectionEfficiency,
      });
    }
  };

  const results = useMemo(() => calculateDexEconomics(params), [params]);

  const formatCurrency = (val: number): string => {
    if (val >= 1_000_000_000) {
      return `$${(val / 1_000_000_000).toFixed(2)}B`;
    }
    if (val >= 1_000_000) {
      return `$${(val / 1_000_000).toFixed(2)}M`;
    }
    if (val >= 1_000) {
      return `$${(val / 1_000).toFixed(1)}k`;
    }
    return `$${val.toFixed(2)}`;
  };

  return (
    <div className="space-y-10">
      
      {/* Header Introduction */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span>Interactive Economic Simulation</span>
          <span aria-hidden="true">·</span>
          <span>Cashflow Waterfall</span>
          <span aria-hidden="true">·</span>
          <span>LVR Recapture Engine</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Protocol Fee & LP Yield Simulator
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Simulate revenue distribution, trader fee savings, and LP annualized yields across varying volume and volatility regimes. Observe how Veritas's <strong>80% direct LP fee streaming</strong> and <strong>LVR toxicity protection</strong> generate higher net yields for depositors despite charging traders over 60% less than Hyperliquid.
        </p>

        {/* Preset Selector */}
        <div className="pt-2">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            Select Market Scenario Preset:
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {SIMULATION_PRESETS.map(preset => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.id)}
                  className={`p-3 text-left rounded-lg border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className={`text-xs font-bold ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-slate-100'}`}>
                    {preset.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {formatCurrency(preset.dailyVolumeUsd)}/day · {preset.takerFeeBps} bps
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Interactive Grid: Controls on Left, Live Outputs on Right */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Sliders & Parameter Tuning (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                Simulation Variables
              </h2>
            </div>
            <button
              onClick={() => handleApplyPreset('hl_current')}
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider 1: Daily Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="daily-volume-slider" className="font-medium text-slate-700 dark:text-slate-300">
                24h Trading Volume
              </label>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {formatCurrency(params.dailyVolumeUsd)}
              </span>
            </div>
            <input
              id="daily-volume-slider"
              type="range"
              min="100000000"
              max="10000000000"
              step="100000000"
              value={params.dailyVolumeUsd}
              onChange={e => {
                setSelectedPresetId('');
                setParams(prev => ({ ...prev, dailyVolumeUsd: Number(e.target.value) }));
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>$100M</span>
              <span>$5B</span>
              <span>$10B</span>
            </div>
          </div>

          {/* Slider 2: Veritas Taker Fee */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="taker-fee-slider" className="font-medium text-slate-700 dark:text-slate-300">
                Veritas Taker Fee Rate
              </label>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {params.takerFeeBps.toFixed(2)} bps ({(params.takerFeeBps / 100).toFixed(3)}%)
              </span>
            </div>
            <input
              id="taker-fee-slider"
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={params.takerFeeBps}
              onChange={e => {
                setSelectedPresetId('');
                setParams(prev => ({ ...prev, takerFeeBps: Number(e.target.value) }));
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0.5 bps (ultra-low)</span>
              <span>1.2 bps (standard)</span>
              <span>2.5 bps</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Hyperliquid comparison benchmark: <strong className="text-slate-700 dark:text-slate-300">2.80 bps</strong>
            </div>
          </div>

          {/* Slider 3: Total LP TVL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="lp-tvl-slider" className="font-medium text-slate-700 dark:text-slate-300">
                User-Owned LP Pool TVL
              </label>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {formatCurrency(params.totalLpTvlUsd)}
              </span>
            </div>
            <input
              id="lp-tvl-slider"
              type="range"
              min="50000000"
              max="2000000000"
              step="50000000"
              value={params.totalLpTvlUsd}
              onChange={e => {
                setSelectedPresetId('');
                setParams(prev => ({ ...prev, totalLpTvlUsd: Number(e.target.value) }));
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>$50M</span>
              <span>$1B</span>
              <span>$2B</span>
            </div>
          </div>

          {/* Slider 4: Toxic Arbitrage Flow % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="toxic-flow-slider" className="font-medium text-slate-700 dark:text-slate-300">
                Toxic / Latency Arbitrage Flow
              </label>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {params.toxicFlowPct}%
              </span>
            </div>
            <input
              id="toxic-flow-slider"
              type="range"
              min="10"
              max="45"
              step="1"
              value={params.toxicFlowPct}
              onChange={e => {
                setSelectedPresetId('');
                setParams(prev => ({ ...prev, toxicFlowPct: Number(e.target.value) }));
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>10% (calm market)</span>
              <span>25%</span>
              <span>45% (panic volatility)</span>
            </div>
          </div>

          {/* Slider 5: LVR Protection Recapture Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="lvr-recapture-slider" className="font-medium text-slate-700 dark:text-slate-300">
                Veritas Toxicity Oracle Recapture
              </label>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {params.lvrProtectionEfficiency}%
              </span>
            </div>
            <input
              id="lvr-recapture-slider"
              type="range"
              min="50"
              max="95"
              step="1"
              value={params.lvrProtectionEfficiency}
              onChange={e => {
                setSelectedPresetId('');
                setParams(prev => ({ ...prev, lvrProtectionEfficiency: Number(e.target.value) }));
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>50%</span>
              <span>85% (calibrated)</span>
              <span>95% (peak)</span>
            </div>
          </div>

        </div>

        {/* Right Column: Comparative Results & Waterfall (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Top Comparative Scorecard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Veritas Net LP Yield */}
            <div className="p-5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Veritas Net LP Annualized Return
              </div>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                {results.veritasLpAprPct.toFixed(1)}% APR
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
                <div>Direct Fee Revenue: <strong className="text-slate-900 dark:text-slate-100 font-mono">{formatCurrency(results.veritasLpRevenueUsd)}/yr</strong></div>
                <div>LVR Arbitrage Recaptured: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">+{formatCurrency(results.veritasLvrSavedUsd)}/yr</strong></div>
              </div>
            </div>

            {/* Hyperliquid HLP Yield Comparison */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Hyperliquid HLP Estimated APY
              </div>
              <div className="text-3xl font-extrabold text-slate-700 dark:text-slate-300 font-mono tabular-nums">
                {results.hyperliquidHlpAprPct.toFixed(1)}% APY
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
                <div>HLP Fee Allocation: <strong className="text-slate-900 dark:text-slate-100 font-mono">{formatCurrency(results.hyperliquidHlpRevenueUsd)}/yr</strong></div>
                <div>Platform Surplus Retained: <span className="text-amber-500 font-mono">{formatCurrency(results.hyperliquidPlatformRetainedUsd)}/yr</span></div>
              </div>
            </div>

          </div>

          {/* Trader Savings Banner */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Total Annual Trader Fee Savings
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                -{results.feeReductionPct.toFixed(1)}% Cheaper Fees
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="text-xs text-slate-500 dark:text-slate-400">Total Capital Saved by Traders</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                  {formatCurrency(results.traderAnnualSavingsUsd)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Per year vs Hyperliquid 2.8 bps rate</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="text-xs text-slate-500 dark:text-slate-400">Savings per $1M Traded</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-0.5">
                  ${results.traderSavingsPerMillionUsd.toFixed(0)} saved
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Direct cost reduction for prop shops & retail</div>
              </div>
            </div>
          </div>

          {/* Veritas Fee Distribution Waterfall */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Veritas Programmatic Fee Waterfall
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Total Fees: {formatCurrency(results.totalAnnualFeesUsd)}/yr
              </span>
            </div>

            {/* Visual Waterfall Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
              <div
                style={{ width: '80%' }}
                className="bg-emerald-600 dark:bg-emerald-500 h-full transition-all duration-300"
                title="80% to User-Owned Liquidity Providers"
              />
              <div
                style={{ width: '10%' }}
                className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-300"
                title="10% to Community Insurance Fund"
              />
              <div
                style={{ width: '10%' }}
                className="bg-purple-600 dark:bg-purple-500 h-full transition-all duration-300"
                title="10% to Staked Governance Token Burn"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10">
                <div className="font-semibold text-emerald-700 dark:text-emerald-400">
                  80% User-Owned LPs
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                  {formatCurrency(results.veritasLpRevenueUsd)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Direct streaming yield</div>
              </div>

              <div className="p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/10">
                <div className="font-semibold text-blue-700 dark:text-blue-400">
                  10% Insurance Reserve
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                  {formatCurrency(results.veritasInsuranceRevenueUsd)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Protocol backstop fund</div>
              </div>

              <div className="p-2.5 rounded-lg border border-purple-100 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/10">
                <div className="font-semibold text-purple-700 dark:text-purple-400">
                  10% Staker Burn
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                  {formatCurrency(results.veritasStakerRevenueUsd)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Deflationary token buyback</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 flex items-start gap-2.5 text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-amber-800 dark:text-amber-300">Hyperliquid Disparity:</strong> Under equivalent volume, Hyperliquid extracts ~{formatCurrency(results.hyperliquidPlatformRetainedUsd)} annually for foundation/private reserves, while Veritas routes 100% of non-gas cashflow to community stakeholders via immutable smart contracts.
              </div>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
};
