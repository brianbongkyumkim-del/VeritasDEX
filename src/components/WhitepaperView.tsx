import React, { useState } from 'react';
import { Copy, Check, Download, BookOpen, Share2 } from 'lucide-react';

export const WhitepaperView: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const WHITEPAPER_MARKDOWN = `# RFC: The Veritas Protocol — A Superior Business Model for Decentralized Exchanges
**Sub-title:** Replacing Monolithic Rent-Extraction with Transparent, User-Owned Liquidity (TUOL) and Dynamic LVR Recapture
**Author:** Veritas Protocol Research Working Group
**Date:** November 2026

---

## 1. Executive Summary & Core Thesis

Hyperliquid has achieved remarkable market traction by demonstrating the viability of high-throughput, on-chain perpetual futures order books. However, its prevailing business model rests on three centralized compromises:
1. **The Monolithic HLP Black Box:** Capital is aggregated into a single counterparty vault (HLP) with closed algorithmic execution, exposing retail depositors to unhedged delta risk and persistent Loss-Versus-Rebalancing (LVR) leakage to latency arbitrageurs.
2. **Platform Rent Extraction:** Hyperliquid charges 2.5–3.5 bps in taker fees, retaining ~55% of non-gas protocol revenue in foundation/ecosystem reserves while subsidizing institutional high-frequency traders with negative maker rebates.
3. **Appchain Liquidity Quarantine:** By operating a sovereign Tendermint-derivative chain, Hyperliquid quarantines liquidity away from the composable EVM money market ecosystem.

**The Veritas Protocol solves this by introducing:**
- **Cost-Plus Micro-Fees (0.8–1.4 bps):** Slashing transaction friction by over 60% for active traders while streaming 80% of fee volume directly to liquidity providers.
- **Transparent User-Owned Liquidity (TUOL) Tranches:** Enabling depositors to select between Senior (Delta-Neutral Capital Preservation), Dynamic Volatility Grid (Range Market Maker), and Junior Alpha (High-Yield Counterparty) vaults with 100% on-chain verifiable strategy code.
- **Dynamic Toxicity Oracle (LVR Recapture):** Real-time cross-venue latency probing that widens spreads specifically against toxic arbitrageurs, recapturing 85%+ of LVR for LP yield.

---

## 2. Comparative Economics at $1.5B 24h Volume

| Dimension | Hyperliquid Baseline | Veritas Protocol | Economic Impact |
| :--- | :--- | :--- | :--- |
| **Average Taker Fee** | 2.80 bps (0.028%) | 1.20 bps (0.012%) | **-57.1% trading cost reduction** |
| **Annual Fee Volume** | $153.3M | $65.7M | **$87.6M saved directly by traders** |
| **LP Fee Share %** | ~45% (HLP) | 80% Programmatic Pass-Through | **1.78x higher direct cashflow streaming** |
| **LP Annual Fee Revenue** | $69.0M | $52.6M + $18.2M LVR Recaptured | **$70.8M total LP net earnings** |
| **Net LP Yield (on $500M TVL)**| 13.8% APY | **14.2% – 38.5% APR (by Tranche)** | **Higher net return with isolated risk** |
| **Discretionary Foundation Tax** | ~55% retained | 0% (100% Programmatic) | **Zero platform rent extraction** |

---

## 3. The Three User-Owned Liquidity (TUOL) Tranches

Unlike Hyperliquid HLP, Veritas segregates systemic risk into isolated, permissionless on-chain tranches:

### A. Senior Delta-Neutral Vault (45% TVL Target)
- **Target Risk:** Low / Capital Preservation
- **Projected Yield:** 12.0% – 16.5% APR
- **Mechanism:** Automatically pairs deposited USDC with synthetic perpetual basis shorting on the internal matching engine. Maintains inventory delta skew below 0.5%, insulating conservative depositors and DAO treasuries from market downturns.

### B. Dynamic Volatility Grid Vault (35% TVL Target)
- **Target Risk:** Moderate / Range Market Maker
- **Projected Yield:** 18.0% – 28.0% APR
- **Mechanism:** Deploys algorithmic micro-limit quote grids around the TWAP mid-price. Spreads dynamically expand as instantaneous volatility rises, capturing the bid-ask spread across retail churn.

### C. Junior Alpha Vault (20% TVL Target)
- **Target Risk:** High / First-Loss Counterparty
- **Projected Yield:** 30.0% – 48.0% APR
- **Mechanism:** Absorbs residual liquidations and non-toxic directional positions. Receives a 1.65x protocol fee multiplier plus 20% of protocol liquidation penalties.

---

## 4. The Dynamic Toxicity Oracle: Eliminating LVR

Loss-Versus-Rebalancing (LVR) represents the permanent capital drain suffered by passive liquidity providers when latency arbitrageurs observe price changes on Binance/Bybit before the DEX book updates.

Veritas deploys a sub-10ms toxicity prober governed by the formula:
\`\`\`
Spread(t) = S_base + λ · max(0, |P_external(t) - P_internal(t)| - ε) · e^(γ · σ_instant)
\`\`\`

When external price velocity surges, incoming order flow is scored for toxicity:
1. **Benign Flow:** Charged the base micro-fee (0.008% - 0.012%).
2. **Toxic Flow:** Charged an adaptive volatility spread, capturing the arbitrageur's edge and converting it into immediate LP dividend yield.

---

## 5. Constitutional Tokenomics: 0% Rent Extraction

Veritas introduces an immutable, non-custodial cashflow waterfall:
- **80% to User-Owned Liquidity Providers:** Continuous streaming yield into LP vault shares.
- **10% to Community Insurance Reserve:** On-chain backstop fund covering bad debt and extreme liquidation shortfalls.
- **10% to Staked Governance Token Burn:** Direct programmatic market buyback and burn, giving the native governance token intrinsic, non-inflationary value accrual.

---

## 6. Conclusion

By aligning trader incentives through lowest-in-class fees and protecting user liquidity through transparent, risk-isolated tranches and LVR recapture, the Veritas Protocol establishes a sustainable, mathematically superior business model for the next generation of decentralized finance.
`;

  const handleCopy = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(WHITEPAPER_MARKDOWN).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }).catch(() => {
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }
    } catch {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    const textArea = document.createElement('textarea');
    textArea.value = WHITEPAPER_MARKDOWN;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Fallback copy failed', e);
    }
    document.body.removeChild(textArea);
  };

  const handleDownload = () => {
    const blob = new Blob([WHITEPAPER_MARKDOWN], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'veritas-dex-business-model-rfc.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Document Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Executive Whitepaper & Request For Comments (RFC)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formatted architectural specification ready for investor, founder, or community distribution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Rendered Publication Content */}
      <article className="p-8 sm:p-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-8 text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
        
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Protocol RFC // Architecture & Economics
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            The Veritas Protocol: A Superior Business Model for Decentralized Exchanges
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
            <span>Author: Veritas Protocol Research Working Group</span>
            <span aria-hidden="true">·</span>
            <span>Focus: Transparent User-Owned Liquidity (TUOL) & Low-Fee Perps</span>
            <span aria-hidden="true">·</span>
            <span>November 2026</span>
          </div>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            1. Executive Summary & Core Thesis
          </h3>
          <p>
            Hyperliquid has achieved notable market traction by demonstrating the viability of high-throughput, on-chain perpetual futures order books. However, its prevailing business model rests on three centralized compromises:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pl-2 text-slate-700 dark:text-slate-300">
            <li>
              <strong>The Monolithic HLP Black Box:</strong> Capital is aggregated into a single counterparty vault (HLP) with closed algorithmic execution, exposing retail depositors to unhedged delta risk and persistent Loss-Versus-Rebalancing (LVR) leakage to latency arbitrageurs.
            </li>
            <li>
              <strong>Platform Rent Extraction:</strong> Hyperliquid charges 2.5–3.5 bps in taker fees, retaining ~55% of non-gas protocol revenue in foundation/ecosystem reserves while subsidizing institutional high-frequency traders with negative maker rebates.
            </li>
            <li>
              <strong>Appchain Liquidity Quarantine:</strong> By operating a sovereign Tendermint-derivative chain, Hyperliquid quarantines liquidity away from the composable EVM money market ecosystem.
            </li>
          </ol>
          <p>
            The <strong>Veritas Protocol</strong> solves this by introducing <strong>Cost-Plus Micro-Fees (0.8–1.4 bps)</strong>, <strong>Transparent User-Owned Liquidity (TUOL) Tranches</strong>, and a <strong>Dynamic Toxicity Oracle</strong> that recaptures 85%+ of LVR for LP yield.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            2. Quantitative Comparison Matrix ($1.5B 24h Volume)
          </h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Dimension</th>
                  <th className="py-2.5 px-3">Hyperliquid Baseline</th>
                  <th className="py-2.5 px-3">Veritas Protocol</th>
                  <th className="py-2.5 px-3">Economic Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold">Average Taker Fee</td>
                  <td className="py-2.5 px-3 text-slate-500">2.80 bps (0.028%)</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">1.20 bps (0.012%)</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-emerald-600">-57% cheaper fees</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold">LP Direct Fee Share</td>
                  <td className="py-2.5 px-3 text-slate-500">~45% (HLP)</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">80% Pass-Through</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-emerald-600">1.78x higher pass-through</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold">Trader Capital Saved</td>
                  <td className="py-2.5 px-3 text-slate-500">$0 (Status Quo)</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">$87.6M / year</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-emerald-600">Retained by active traders</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold">LP Net Yield ($500M TVL)</td>
                  <td className="py-2.5 px-3 text-slate-500">13.8% APY</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">14.8% – 38.5% APR</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-emerald-600">By user risk choice</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold">Foundation Discretionary Tax</td>
                  <td className="py-2.5 px-3 text-amber-500">~55% retained</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">0% (Immutable)</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-emerald-600">Zero rent-seeking</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            3. The Three User-Owned Liquidity (TUOL) Tranches
          </h3>
          <p>
            Unlike Hyperliquid's singular HLP vault, Veritas introduces three distinct risk-isolated pools:
          </p>
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-slate-100">Senior Delta-Neutral Vault (45% TVL):</strong> Employs continuous synthetic basis hedging on the internal matching engine to neutralize directional exposure. Guarantees 12–16% APR with zero liquidation risk, unlocking capital from risk-averse DAOs and treasuries.
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-slate-100">Dynamic Volatility Grid Vault (35% TVL):</strong> Places algorithmic TWAP bid-ask grids that dynamically expand with real-time volatility, earning 18–28% APR from retail churn and maker rebates.
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-slate-100">Junior Alpha Vault (20% TVL):</strong> First-loss counterparty absorbing high-volatility liquidations with a 1.65x fee multiplier and 20% liquidation bonuses, delivering 30–48% APR for risk-tolerant capital.
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            4. The Toxicity Oracle: Recapturing Loss-Versus-Rebalancing (LVR)
          </h3>
          <p>
            When external CEXs (Binance, OKX) experience fast price dislocations, high-frequency arbitrageurs exploit stale limit orders on decentralized exchanges. This toxic flow drains 3–7% annualized from passive LPs.
          </p>
          <p>
            Veritas integrates a dynamic toxicity prober that inflates the bid-ask spread exponentially during latency anomalies:
          </p>
          <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-emerald-400 text-center">
            Spread(t) = S_base + λ · max(0, |P_external(t) - P_internal(t)| - ε) · e^(γ · σ_instant)
          </div>
          <p>
            This forces predatory arbitrageurs to pay an adaptive volatility premium, converting what was previously a severe LP loss into pure streaming yield for depositors.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            5. Conclusion
          </h3>
          <p>
            By transitioning from Hyperliquid's rent-seeking, monolithic vault paradigm to a democratized, cost-plus exchange with transparent, user-curated liquidity pools, Veritas creates a self-reinforcing liquidity flywheel that scales faster, protects depositors, and establishes the gold standard for decentralized derivatives.
          </p>
        </div>

      </article>

    </div>
  );
};
