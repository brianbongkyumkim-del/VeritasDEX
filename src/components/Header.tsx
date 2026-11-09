import React from 'react';
import { ActiveTab } from '../types';
import { ShieldCheck, Moon, Sun, PlusCircle, Wallet } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  userBalanceUsdc: number;
  onAddFaucet: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  userBalanceUsdc,
  onAddFaucet,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-2.5">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <button
            onClick={() => onTabChange('trade')}
            className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
            aria-label="Veritas Protocol Homepage"
          >
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap block">
              Veritas DEX
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-5 lg:gap-7 text-xs font-semibold text-slate-600 dark:text-slate-400"
        >
          <button
            onClick={() => onTabChange('trade')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'trade'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Trade (Perps)
          </button>

          <button
            onClick={() => onTabChange('pools')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'pools'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            User-Owned Pools
          </button>

          <button
            onClick={() => onTabChange('oracle')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'oracle'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Toxicity Oracle
          </button>

          <button
            onClick={() => onTabChange('simulator')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'simulator'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Simulator
          </button>

          <button
            onClick={() => onTabChange('comparison')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'comparison'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Hyperliquid Critique
          </button>

          <button
            onClick={() => onTabChange('digitalx')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'digitalx'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            DigitalX 제안서
          </button>

          <button
            onClick={() => onTabChange('korbit')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'korbit'
                ? 'text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Korbit 제안서
          </button>

          <button
            onClick={() => onTabChange('whitepaper')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'whitepaper'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            RFC Whitepaper
          </button>
        </nav>

        {/* Zone 3: Wallet + Faucet + Theme */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Faucet Button */}
          <button
            onClick={onAddFaucet}
            title="Add +$10,000 Testnet USDC to wallet"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>+$10k USDC</span>
          </button>

          {/* Connected Wallet Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900 text-xs font-mono">
            <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              ${userBalanceUsdc.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="hidden lg:inline text-slate-400 text-[10px]">0x71C...4b92</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
};
