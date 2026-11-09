import React, { useState } from 'react';
import { COMPARISON_DIMENSIONS } from '../data/protocolComparison';
import { ArrowRight, CheckCircle2, AlertTriangle, Scale, Zap, Shield, Database } from 'lucide-react';

interface ComparisonViewProps {
  onGoToSimulator: () => void;
  onGoToPools: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  onGoToSimulator,
  onGoToPools,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'liquidity' | 'fees' | 'tech'>('all');

  const filteredDimensions = COMPARISON_DIMENSIONS.filter(dim => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'liquidity') return dim.id.includes('liquidity') || dim.id.includes('lvr');
    if (selectedFilter === 'fees') return dim.id.includes('fee') || dim.id.includes('maker');
    if (selectedFilter === 'tech') return dim.id.includes('composability') || dim.id.includes('tokenomics');
    return true;
  });

  return (
    <div className="space-y-10">
      
      {/* Hero Narrative Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span>Decentralized Exchange Business Model Proposal</span>
          <span aria-hidden="true">·</span>
          <span>Hyperliquid Architecture Critique & Solution</span>
          <span aria-hidden="true">·</span>
          <span>Veritas Protocol Blueprint</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 max-w-3xl">
          Transparent, User-Owned Liquidity: A Low-Fee Alternative to Hyperliquid
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
          While Hyperliquid successfully proved product-market fit for high-performance on-chain perps, its business model suffers from three structural flaws: <strong>a closed-box monolithic counterparty vault (HLP)</strong> that leaves retail depositors vulnerable to toxic latency arbitrage, <strong>monopolistic take-rates (2.5–3.5 bps)</strong> that extract platform rent, and <strong>isolated appchain lock-in</strong>.
        </p>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
          The <strong>Veritas Protocol</strong> replaces centralized platform rent with a <strong>Cost-Plus Micro-Fee Model (0.8–1.4 bps)</strong>, democratizes market making through <strong>Transparent User-Owned Liquidity (TUOL) tranches</strong>, and deploys a <strong>Dynamic Toxicity Oracle</strong> that recaptures 85%+ of Loss-Versus-Rebalancing (LVR) for depositors.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onGoToSimulator}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <span>Launch Economic Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onGoToPools}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <span>Explore User-Owned Pools</span>
          </button>
        </div>
      </section>

      {/* KPI Comparison Ribbon */}
      <section aria-labelledby="kpi-heading" className="space-y-3">
        <h2 id="kpi-heading" className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
          Key Economic Indicators: Hyperliquid vs. Veritas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">Average Taker Fee</div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm line-through text-slate-400 dark:text-slate-500 font-mono">2.8 bps</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">1.1 bps</span>
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">61% cost reduction for traders</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">Direct Fee Share to LPs</div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-slate-400 dark:text-slate-500 font-mono">~45% (HLP)</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">80.0%</span>
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">1.78x higher direct cashflow streaming</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">LP Risk Architecture</div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-amber-500 font-medium">Monolithic Vault</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">3 Isolated Tranches</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Senior (hedged), Grid, Junior Alpha</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">Toxic Flow / LVR Protection</div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-red-500 font-medium">Unmitigated</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">85% Recaptured</span>
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Dynamic Toxicity Oracle Spread</div>
          </div>

        </div>
      </section>

      {/* Interactive Category Filter */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Structural Dimension Breakdown
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Compare institutional risk parameters, revenue models, and governance guarantees.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg shrink-0">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All Dimensions
            </button>
            <button
              onClick={() => setSelectedFilter('liquidity')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilter === 'liquidity'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Liquidity & Pools
            </button>
            <button
              onClick={() => setSelectedFilter('fees')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilter === 'fees'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Fees & Economics
            </button>
            <button
              onClick={() => setSelectedFilter('tech')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilter === 'tech'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Composability & Token
            </button>
          </div>
        </div>

        {/* Dimension Comparison Cards */}
        <div className="space-y-6">
          {filteredDimensions.map((dimension, idx) => (
            <article
              key={dimension.id}
              className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500">
                    0{idx + 1}.
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    {dimension.title}
                  </h3>
                </div>
                <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {dimension.metricImpact}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Hyperliquid Side */}
                <div className="p-4 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      Hyperliquid Model
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {dimension.hyperliquidApproach.label}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {dimension.hyperliquidApproach.description}
                  </p>
                  <div className="pt-2 border-t border-amber-200/40 dark:border-amber-900/30">
                    <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
                      Core Vulnerability
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                      {dimension.hyperliquidApproach.vulnerability}
                    </div>
                  </div>
                </div>

                {/* Veritas Protocol Side */}
                <div className="p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      Veritas Protocol Model
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {dimension.veritasApproach.label}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {dimension.veritasApproach.description}
                  </p>
                  <div className="pt-2 border-t border-emerald-200/40 dark:border-emerald-900/30">
                    <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">
                      Strategic Advantage
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                      {dimension.veritasApproach.advantage}
                    </div>
                  </div>
                </div>

              </div>
            </article>
          ))}
        </div>
      </section>

      {/* The 4 Architectural Pillars Summary */}
      <section className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Why This Model Scales Faster & Cheaper
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-sm">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Volume Magnetization</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sub-basis-point fees (0.8–1.4 bps) attract high-turnover algorithmic traders and market makers who are currently taxed out of Hyperliquid and CEX order books.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-sm">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Institutional Capital Safety</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Treasuries, DAOs, and funds cannot deposit into monolithic HLP due to unhedged delta risk. Veritas's Senior Delta-Neutral tranche unlocks hundreds of millions in conservative institutional liquidity.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-sm">
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>100% EVM Composability</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              LP tokens can be deposited as collateral into lending markets (Morpho/Aave) and yield aggregators without being quarantined inside a bespoke isolated appchain.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
