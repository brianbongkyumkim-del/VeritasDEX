import React, { useState } from 'react';
import { PROTOCOL_MECHANISMS, MechanismDetail } from '../data/mechanisms';
import { Cpu, ArrowRight, Check, AlertCircle } from 'lucide-react';

export const MechanismsView: React.FC = () => {
  const [selectedMechanismId, setSelectedMechanismId] = useState<string>('lvr_engine');

  const activeMechanism = PROTOCOL_MECHANISMS.find(m => m.id === selectedMechanismId) || PROTOCOL_MECHANISMS[0];

  return (
    <div className="space-y-10">
      
      {/* Intro Header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span>Protocol Engineering Specifications</span>
          <span aria-hidden="true">·</span>
          <span>Mathematical Formulation</span>
          <span aria-hidden="true">·</span>
          <span>System Invariants</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Core Protocol Mechanisms & Architecture
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Explore the four foundational engineering breakthroughs that enable Veritas to deliver <strong>sub-basis-point fees</strong> while providing <strong>higher net APY to liquidity providers</strong> than Hyperliquid.
        </p>
      </section>

      {/* Mechanism Navigation Tabs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PROTOCOL_MECHANISMS.map(mech => {
          const isSelected = selectedMechanismId === mech.id;
          return (
            <button
              key={mech.id}
              onClick={() => setSelectedMechanismId(mech.id)}
              className={`p-4 text-left rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-xs ring-1 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-bold text-slate-400 dark:text-slate-500">
                  {mech.number}
                </span>
                {isSelected && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Active
                  </span>
                )}
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                {mech.title}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {mech.subtitle}
              </p>
            </button>
          );
        })}
      </section>

      {/* Active Mechanism Deep Dive Display */}
      <article className="p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-8">
        
        {/* Header Block */}
        <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            Mechanism {activeMechanism.number}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {activeMechanism.title}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {activeMechanism.subtitle}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-2">
            {activeMechanism.summary}
          </p>
        </div>

        {/* Mathematical Formulation Card */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Mathematical Formulation
            </span>
            <span>Invariant Engine</span>
          </div>

          <div className="py-2 overflow-x-auto text-center sm:text-left">
            <code className="text-sm sm:text-base font-mono font-bold text-emerald-300">
              {activeMechanism.formula.expression}
            </code>
          </div>

          <p className="text-xs text-slate-400 italic">
            {activeMechanism.formula.description}
          </p>

          {/* Variables Table */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {activeMechanism.formula.variables.map(v => (
              <div key={v.symbol} className="flex items-baseline gap-2">
                <span className="font-mono font-bold text-emerald-400 text-xs shrink-0">
                  {v.symbol}:
                </span>
                <span className="text-slate-300 text-[11px]">
                  {v.meaning}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Execution Sequence */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
            Execution Flow & State Machine
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMechanism.howItWorks.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Step {idx + 1}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Advantages vs Hyperliquid Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <div className="p-5 rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Core Strategic Advantages
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {activeMechanism.keyAdvantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Direct Contrast with Hyperliquid
            </h4>
            <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>{activeMechanism.hyperliquidContrast}</span>
            </div>
          </div>

        </div>

      </article>

    </div>
  );
};
