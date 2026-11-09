import React, { useState, useEffect } from 'react';
import { ToxicityOracleTelemetry } from '../../types';
import { AlertTriangle, ShieldCheck, Zap, ArrowRight, Gauge, Activity } from 'lucide-react';

export const ToxicityOracleView: React.FC = () => {
  const [telemetry, setTelemetry] = useState<ToxicityOracleTelemetry>({
    externalCexIndexPrice: 3245.80,
    internalMidPrice: 3245.75,
    priceDivergencePct: 0.0015,
    toxicityScore: 0.12,
    spreadMultiplier: 1.0,
    veritasEffectiveSpreadBps: 0.8,
    hyperliquidFixedSpreadBps: 2.8,
    totalLvrDollarsSaved: 18_425_800,
    isShockActive: false,
  });

  const [shockCountdown, setShockCountdown] = useState<number>(0);

  // Normal live micro tick
  useEffect(() => {
    if (telemetry.isShockActive) return;

    const interval = setInterval(() => {
      setTelemetry(prev => {
        const jitter = (Math.random() - 0.5) * 0.4;
        const ext = Number((3245.80 + jitter).toFixed(2));
        const internal = Number((3245.78 + jitter * 0.9).toFixed(2));
        const div = Math.abs((ext - internal) / ext);
        const tox = Number((0.08 + Math.random() * 0.10).toFixed(2));
        return {
          ...prev,
          externalCexIndexPrice: ext,
          internalMidPrice: internal,
          priceDivergencePct: Number((div * 100).toFixed(4)),
          toxicityScore: tox,
          veritasEffectiveSpreadBps: Number((0.8 + tox * 0.4).toFixed(2)),
          totalLvrDollarsSaved: prev.totalLvrDollarsSaved + Math.floor(Math.random() * 8 + 2),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [telemetry.isShockActive]);

  // Handle Trigger Shock
  const handleTriggerShock = () => {
    setTelemetry(prev => ({
      ...prev,
      isShockActive: true,
      externalCexIndexPrice: 3295.40, // Instant +1.5% jump on Binance/OKX
      internalMidPrice: 3245.80, // Stale book internal
      priceDivergencePct: 1.52,
      toxicityScore: 0.94, // Peak toxic flow detected!
      spreadMultiplier: 3.8,
      veritasEffectiveSpreadBps: 3.8, // Spread automatically inflates to stop arbitrageurs!
      totalLvrDollarsSaved: prev.totalLvrDollarsSaved + 142_500,
    }));

    setShockCountdown(6);
  };

  // Shock decay timer
  useEffect(() => {
    if (shockCountdown <= 0) {
      if (telemetry.isShockActive) {
        setTelemetry(prev => ({
          ...prev,
          isShockActive: false,
          internalMidPrice: prev.externalCexIndexPrice,
          priceDivergencePct: 0.002,
          toxicityScore: 0.15,
          spreadMultiplier: 1.0,
          veritasEffectiveSpreadBps: 0.8,
        }));
      }
      return;
    }

    const timer = setTimeout(() => {
      setShockCountdown(c => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [shockCountdown, telemetry.isShockActive]);

  return (
    <div className="space-y-8">
      
      {/* Intro Header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span>Real-Time LVR Recapture Telemetry</span>
          <span aria-hidden="true">·</span>
          <span>Cross-Venue Latency Prober</span>
          <span aria-hidden="true">·</span>
          <span>Adaptive Spread Engine</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Dynamic Toxicity Oracle & LVR Recapture
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
              Observe how Veritas monitors global external liquidity venues (Binance, Bybit) and automatically widens order book spreads during latency arbitrage surges to protect user-owned liquidity.
            </p>
          </div>

          <button
            onClick={handleTriggerShock}
            disabled={telemetry.isShockActive}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0 ${
              telemetry.isShockActive
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{telemetry.isShockActive ? `Shock Active (${shockCountdown}s)` : 'Simulate CEX Volatility Shock'}</span>
          </button>
        </div>
      </section>

      {/* Primary Telemetry Scorecards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Toxicity Score */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Toxicity Index (τ)</span>
            <Gauge className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className={`text-3xl font-extrabold font-mono tabular-nums ${
            telemetry.toxicityScore > 0.6 ? 'text-rose-500' : telemetry.toxicityScore > 0.3 ? 'text-amber-500' : 'text-emerald-500'
          }`}>
            {telemetry.toxicityScore.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500">
            {telemetry.toxicityScore > 0.6 ? 'Critical Arbitrage Spike' : 'Benign Retail Flow'}
          </div>
        </div>

        {/* Card 2: Veritas Effective Spread */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Veritas Dynamic Spread</span>
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {telemetry.veritasEffectiveSpreadBps.toFixed(1)} bps
          </div>
          <div className="text-[11px] text-slate-500">
            Adaptive vs HL fixed 2.8 bps
          </div>
        </div>

        {/* Card 3: Price Divergence */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>CEX-DEX Divergence</span>
            <span className="font-mono text-[10px]">|P_ext - P_int|</span>
          </div>
          <div className={`text-3xl font-extrabold font-mono tabular-nums ${
            telemetry.priceDivergencePct > 0.5 ? 'text-amber-500' : 'text-slate-900 dark:text-slate-100'
          }`}>
            {telemetry.priceDivergencePct.toFixed(3)}%
          </div>
          <div className="text-[11px] text-slate-500">
            External: ${telemetry.externalCexIndexPrice.toFixed(2)}
          </div>
        </div>

        {/* Card 4: Cumulative LVR Recaptured */}
        <div className="p-5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
            <span>LVR Arbitrage Recaptured</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            ${(telemetry.totalLvrDollarsSaved / 1_000_000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
            Preserved directly for LP vaults
          </div>
        </div>

      </section>

      {/* Visual Live Mechanism Comparison */}
      <section className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          How Dynamic LVR Recapture Outperforms Hyperliquid HLP
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Hyperliquid Failure Mode */}
          <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Hyperliquid Passive Exposure</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When Binance moves by +1.5% in 150ms, Hyperliquid's central HLP book continues quoting stale asks. High-frequency arbitrageurs pick off these stale asks before the book updates, draining capital from retail HLP depositors.
            </p>
            <div className="p-3 rounded-lg bg-amber-100/60 dark:bg-amber-900/30 text-xs font-mono text-amber-900 dark:text-amber-200">
              HLP Loss = Arbitrage Volume × Price Dislocation = -$142,500
            </div>
          </div>

          {/* Veritas Active Protection */}
          <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Veritas Toxicity Oracle Protection</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The Toxicity Oracle detects the external price velocity (|dP/dt| &gt; θ) in sub-10ms. Veritas instantly widens the spread to 3.8 bps for toxic arbitrage orders, neutralizing their latency edge and routing their fee into LP yield.
            </p>
            <div className="p-3 rounded-lg bg-emerald-100/60 dark:bg-emerald-900/30 text-xs font-mono text-emerald-900 dark:text-emerald-200">
              Veritas Gain = Toxic Flow × Adaptive Spread = +$142,500 to LPs!
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
