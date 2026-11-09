import React, { useState, useEffect } from 'react';
import { DEFAULT_TRANCHES } from '../../utils/economics';
import { UserPoolDeposit } from '../../types';
import { calculatePoolDeposit, calculatePoolWithdrawal } from '../../utils/tradeEngine';
import { Shield, Activity, Flame, Plus, Minus, Coins, Check, ArrowRight } from 'lucide-react';

interface PoolsManagementProps {
  userBalanceUsdc: number;
  onUpdateBalance: (newBalance: number) => void;
  userDeposits: UserPoolDeposit[];
  setUserDeposits: React.Dispatch<React.SetStateAction<UserPoolDeposit[]>>;
}

export const PoolsManagement: React.FC<PoolsManagementProps> = ({
  userBalanceUsdc,
  onUpdateBalance,
  userDeposits,
  setUserDeposits,
}) => {
  const [activeModalTranche, setActiveModalTranche] = useState<'senior' | 'grid' | 'junior' | null>(null);
  const [modalMode, setModalMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [actionAmount, setActionAmount] = useState<string>('5000');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live yield streaming ticker (accrues real-time yield every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setUserDeposits(prev =>
        prev.map(dep => {
          const secondYield = (dep.currentValueUsdc * (dep.aprPct / 100)) / (365 * 24 * 3600) * 3;
          return {
            ...dep,
            accruedYieldUsdc: Number((dep.accruedYieldUsdc + secondYield).toFixed(4)),
            currentValueUsdc: Number((dep.currentValueUsdc + secondYield).toFixed(4)),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [setUserDeposits]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenModal = (trancheId: 'senior' | 'grid' | 'junior', mode: 'deposit' | 'withdraw') => {
    setActiveModalTranche(trancheId);
    setModalMode(mode);
    if (mode === 'deposit') {
      setActionAmount('5000');
    } else {
      const dep = userDeposits.find(d => d.trancheId === trancheId);
      setActionAmount(dep ? Math.floor(dep.currentValueUsdc).toString() : '0');
    }
  };

  const handleConfirmAction = () => {
    if (!activeModalTranche) return;
    const amount = Number(actionAmount);
    if (isNaN(amount) || amount <= 0) return;

    const trancheInfo = DEFAULT_TRANCHES.find(t => t.id === activeModalTranche)!;

    if (modalMode === 'deposit') {
      if (amount > userBalanceUsdc) {
        alert(`Insufficient USDC balance! Available: $${userBalanceUsdc.toFixed(2)}`);
        return;
      }

      const { sharesMinted } = calculatePoolDeposit(amount, 100_000_000, 100_000_000);
      onUpdateBalance(userBalanceUsdc - amount);

      setUserDeposits(prev => {
        const existing = prev.find(d => d.trancheId === activeModalTranche);
        if (existing) {
          return prev.map(d =>
            d.trancheId === activeModalTranche
              ? {
                  ...d,
                  depositedUsdc: d.depositedUsdc + amount,
                  currentValueUsdc: d.currentValueUsdc + amount,
                  shares: d.shares + sharesMinted,
                }
              : d
          );
        } else {
          return [
            ...prev,
            {
              trancheId: activeModalTranche,
              shares: sharesMinted,
              depositedUsdc: amount,
              currentValueUsdc: amount,
              accruedYieldUsdc: 0,
              aprPct: trancheInfo.projectedAprPct,
              depositTimestamp: Date.now(),
            },
          ];
        }
      });

      showToast(`Successfully deposited $${amount.toLocaleString()} into ${trancheInfo.name}!`);
      setActiveModalTranche(null);
    } else {
      // Withdraw
      const existing = userDeposits.find(d => d.trancheId === activeModalTranche);
      if (!existing || amount > existing.currentValueUsdc) {
        alert('Withdrawal amount exceeds deposited balance.');
        return;
      }

      const fraction = amount / existing.currentValueUsdc;
      const sharesToBurn = existing.shares * fraction;
      const { usdcReceived } = calculatePoolWithdrawal(sharesToBurn, existing.currentValueUsdc, existing.shares);

      onUpdateBalance(userBalanceUsdc + usdcReceived);

      setUserDeposits(prev =>
        prev
          .map(d => {
            if (d.trancheId === activeModalTranche) {
              const remainingValue = d.currentValueUsdc - usdcReceived;
              return {
                ...d,
                shares: d.shares - sharesToBurn,
                currentValueUsdc: remainingValue,
                depositedUsdc: Math.max(0, d.depositedUsdc - usdcReceived),
              };
            }
            return d;
          })
          .filter(d => d.currentValueUsdc > 0.5)
      );

      showToast(`Successfully redeemed $${usdcReceived.toLocaleString()} from ${trancheInfo.name}!`);
      setActiveModalTranche(null);
    }
  };

  const handleHarvestYield = (trancheId: 'senior' | 'grid' | 'junior') => {
    const dep = userDeposits.find(d => d.trancheId === trancheId);
    if (!dep || dep.accruedYieldUsdc <= 0.01) return;

    const yieldAmount = dep.accruedYieldUsdc;
    onUpdateBalance(userBalanceUsdc + yieldAmount);

    setUserDeposits(prev =>
      prev.map(d =>
        d.trancheId === trancheId
          ? {
              ...d,
              currentValueUsdc: d.currentValueUsdc - yieldAmount,
              accruedYieldUsdc: 0,
            }
          : d
      )
    );

    showToast(`Harvested +$${yieldAmount.toFixed(2)} in streaming fee yields!`);
  };

  return (
    <div className="space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white font-medium rounded-xl shadow-lg flex items-center gap-2 text-sm animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Intro Header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span>Executable Liquidity Management</span>
          <span aria-hidden="true">·</span>
          <span>100% On-Chain Risk Isolation</span>
          <span aria-hidden="true">·</span>
          <span>Real-Time Streaming Yield</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              User-Owned Liquidity (TUOL) Pools
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
              Deposit capital into open-source market making tranches. Unlike Hyperliquid HLP, your capital is segregated into isolated risk profiles with automated delta hedging and real-time yield streaming.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shrink-0 text-right">
            <span className="text-[11px] text-slate-500 block">Connected Wallet Balance</span>
            <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              ${userBalanceUsdc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
            </span>
          </div>
        </div>
      </section>

      {/* Tranches Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {DEFAULT_TRANCHES.map(tranche => {
          const userDep = userDeposits.find(d => d.trancheId === tranche.id);
          const hasDeposit = userDep && userDep.currentValueUsdc > 0;

          let icon = <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
          if (tranche.id === 'grid') icon = <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
          if (tranche.id === 'junior') icon = <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />;

          return (
            <div
              key={tranche.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-6"
            >
              
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                      {icon}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {tranche.name}
                      </h2>
                      <span className="text-xs text-slate-500 font-medium">Risk: {tranche.targetRisk}</span>
                    </div>
                  </div>

                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    tranche.targetRisk === 'Low'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                      : tranche.targetRisk === 'Moderate'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                  }`}>
                    {tranche.targetRisk}
                  </span>
                </div>

                {/* APR Metric */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500">Projected Streaming APY</div>
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                      {tranche.projectedAprPct}%
                    </div>
                  </div>
                  <div className="text-right text-xs font-mono text-slate-500">
                    <div>Floor: {tranche.minAprPct}%</div>
                    <div>Weight: {tranche.feeWeight}x</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-[3.5rem]">
                  {tranche.description}
                </p>

                {/* User Active Position in this Pool */}
                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Your Active Capital</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      ${hasDeposit ? userDep.currentValueUsdc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'} USDC
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Accrued Yield:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        +${hasDeposit ? userDep.accruedYieldUsdc.toFixed(4) : '0.0000'}
                      </span>
                      {hasDeposit && userDep.accruedYieldUsdc > 0.05 && (
                        <button
                          onClick={() => handleHarvestYield(tranche.id)}
                          className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded hover:bg-emerald-200 cursor-pointer"
                        >
                          Harvest
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Deposit & Redeem */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleOpenModal(tranche.id, 'deposit')}
                  className="py-2 px-3 text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Deposit USDC</span>
                </button>

                <button
                  onClick={() => handleOpenModal(tranche.id, 'withdraw')}
                  disabled={!hasDeposit}
                  className={`py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    hasDeposit
                      ? 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer'
                      : 'border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>Redeem</span>
                </button>
              </div>

            </div>
          );
        })}
      </section>

      {/* Deposit/Withdraw Modal */}
      {activeModalTranche && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {modalMode === 'deposit' ? 'Deposit to' : 'Redeem from'} {DEFAULT_TRANCHES.find(t => t.id === activeModalTranche)?.name}
              </h3>
              <button
                onClick={() => setActiveModalTranche(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <label htmlFor="action-amount-input">Amount (USDC)</label>
                <span className="font-mono">
                  {modalMode === 'deposit'
                    ? `Wallet: $${userBalanceUsdc.toFixed(2)}`
                    : `Deposited: $${(userDeposits.find(d => d.trancheId === activeModalTranche)?.currentValueUsdc || 0).toFixed(2)}`}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">$</span>
                <input
                  id="action-amount-input"
                  type="number"
                  min="100"
                  step="100"
                  value={actionAmount}
                  onChange={e => setActionAmount(e.target.value)}
                  className="w-full pl-8 pr-16 py-2.5 text-base font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute right-3 top-3 text-slate-400 font-mono text-xs">USDC</span>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex gap-2 pt-1">
                {[1000, 5000, 25000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setActionAmount(amt.toString())}
                    className="px-2.5 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 cursor-pointer"
                  >
                    ${amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Lockup Period:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">0 Seconds (Instant)</span>
              </div>
              <div className="flex justify-between">
                <span>Fee Pass-Through:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">80% Protocol Fee Share</span>
              </div>
            </div>

            <button
              onClick={handleConfirmAction}
              className="w-full py-2.5 px-4 rounded-lg font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer transition-colors shadow-xs"
            >
              Confirm {modalMode === 'deposit' ? 'Deposit' : 'Redemption'}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
