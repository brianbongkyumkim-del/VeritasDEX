import React, { useState, useEffect } from 'react';
import { ActiveTab, UserPoolDeposit, TradeHistoryItem } from './types';
import { Position } from './utils/tradeEngine';
import { Header } from './components/Header';
import { TradeTerminal } from './components/trading/TradeTerminal';
import { PoolsManagement } from './components/pools/PoolsManagement';
import { ToxicityOracleView } from './components/oracle/ToxicityOracleView';
import { SimulatorView } from './components/SimulatorView';
import { ComparisonView } from './components/ComparisonView';
import { WhitepaperView } from './components/WhitepaperView';
import { DigitalXProposalView } from './components/DigitalXProposalView';
import { KorbitProposalView } from './components/KorbitProposalView';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('trade');
  const [isDark, setIsDark] = useState<boolean>(true);

  // User simulated wallet balance in USDC
  const [userBalanceUsdc, setUserBalanceUsdc] = useState<number>(35000);

  // Open active trading positions
  const [positions, setPositions] = useState<Position[]>([
    {
      id: 'pos-init-1',
      market: 'ETH-PERP',
      side: 'long',
      sizeUsd: 15000,
      sizeAsset: 4.6213,
      entryPrice: 3245.80,
      currentPrice: 3245.80,
      leverage: 10,
      marginUsd: 1500,
      liquidationPrice: 2986.14,
      unrealizedPnlUsd: 0,
      unrealizedPnlPct: 0,
      openTimestamp: Date.now() - 3600000,
    }
  ]);

  // Executed trade history
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([
    {
      id: 'trade-init-1',
      timestamp: Date.now() - 3600000,
      market: 'ETH-PERP',
      side: 'long',
      sizeUsd: 15000,
      sizeAsset: 4.6213,
      price: 3245.80,
      feePaidUsd: 1.65,
      lvrSavedUsd: 2.55,
    }
  ]);

  // User active deposits in TUOL pools
  const [userDeposits, setUserDeposits] = useState<UserPoolDeposit[]>([
    {
      trancheId: 'senior',
      shares: 20000,
      depositedUsdc: 20000,
      currentValueUsdc: 20485.40,
      accruedYieldUsdc: 485.40,
      aprPct: 14.8,
      depositTimestamp: Date.now() - 86400000 * 14,
    },
    {
      trancheId: 'grid',
      shares: 10000,
      depositedUsdc: 10000,
      currentValueUsdc: 10320.25,
      accruedYieldUsdc: 320.25,
      aprPct: 24.2,
      depositTimestamp: Date.now() - 86400000 * 7,
    }
  ]);

  // Initialize theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const handleAddFaucet = () => {
    setUserBalanceUsdc(prev => prev + 10000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-500 transition-colors">
      
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onTabChange={tab => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        userBalanceUsdc={userBalanceUsdc}
        onAddFaucet={handleAddFaucet}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8">
        
        {activeTab === 'trade' && (
          <TradeTerminal
            userBalanceUsdc={userBalanceUsdc}
            onUpdateBalance={setUserBalanceUsdc}
            positions={positions}
            setPositions={setPositions}
            tradeHistory={tradeHistory}
            setTradeHistory={setTradeHistory}
          />
        )}

        {activeTab === 'pools' && (
          <PoolsManagement
            userBalanceUsdc={userBalanceUsdc}
            onUpdateBalance={setUserBalanceUsdc}
            userDeposits={userDeposits}
            setUserDeposits={setUserDeposits}
          />
        )}

        {activeTab === 'oracle' && <ToxicityOracleView />}

        {activeTab === 'simulator' && <SimulatorView />}

        {activeTab === 'comparison' && (
          <ComparisonView
            onGoToSimulator={() => setActiveTab('simulator')}
            onGoToPools={() => setActiveTab('pools')}
          />
        )}

        {activeTab === 'digitalx' && (
          <DigitalXProposalView
            onGoToSimulator={() => setActiveTab('simulator')}
            onGoToPools={() => setActiveTab('pools')}
          />
        )}

        {activeTab === 'korbit' && (
          <KorbitProposalView
            onGoToSimulator={() => setActiveTab('simulator')}
            onGoToPools={() => setActiveTab('pools')}
          />
        )}

        {activeTab === 'whitepaper' && <WhitepaperView />}

      </main>

      {/* Clean Global Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-6 px-4 sm:px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Veritas Protocol DEX</span>
            <span aria-hidden="true">·</span>
            <span>Transparent User-Owned Liquidity (TUOL)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('trade')}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              Trade
            </button>
            <button
              onClick={() => setActiveTab('pools')}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              Pools
            </button>
            <button
              onClick={() => setActiveTab('oracle')}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              Toxicity Oracle
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              Simulator
            </button>
            <button
              onClick={() => setActiveTab('digitalx')}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline transition-colors cursor-pointer"
            >
              DigitalX 제안서
            </button>
            <button
              onClick={() => setActiveTab('korbit')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline transition-colors cursor-pointer"
            >
              Korbit 제안서
            </button>
            <button
              onClick={() => setActiveTab('whitepaper')}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              Whitepaper
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Sub-basis-point fees · 80% direct LP streaming · LVR protection
          </div>

        </div>
      </footer>

    </div>
  );
}
