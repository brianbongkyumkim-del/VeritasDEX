export interface MechanismDetail {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  howItWorks: string[];
  formula: {
    expression: string;
    description: string;
    variables: { symbol: string; meaning: string }[];
  };
  keyAdvantages: string[];
  hyperliquidContrast: string;
}

export const PROTOCOL_MECHANISMS: MechanismDetail[] = [
  {
    id: 'lvr_engine',
    number: '01',
    title: 'Dynamic LVR-Recapture Curve',
    subtitle: 'Preventing Toxic Flow Exploitation via Real-Time Oracle Spread Adaptation',
    summary: 'In conventional DEXs and passive pools like Hyperliquid HLP, high-frequency arbitrageurs exploit latency differences between Binance/Bybit and the DEX order book, extracting Loss-Versus-Rebalancing (LVR) from passive depositors. Veritas deploys an on-chain high-frequency toxicity prober that measures instantaneous skew and cross-venue divergence, dynamically expanding the spread precisely during latency attacks.',
    howItWorks: [
      'Continuous sub-10ms oracle probers compare the internal book mid-price against aggregated global multi-venue spot/perp feeds.',
      'When external price velocity exceeds a critical threshold |dP/dt| > θ, incoming orders are classified by toxicity score τ ∈ [0, 1].',
      'The engine expands the required taker spread by a dynamic toxicity multiplier, converting would-be arbitrage extraction into immediate protocol fee yield for LPs.',
      'Benign retail flow and rebalancing flow are granted the baseline low fee (0.008% - 0.012%), while predatory latency arbitrageurs pay for their informational advantage.'
    ],
    formula: {
      expression: 'Spread(t) = S_base + λ · max(0, |P_external(t) - P_internal(t)| - ε) · e^(γ · σ_instant)',
      description: 'The dynamic fee spread scales exponentially with instantaneous volatility and linear price divergence above the normal friction boundary.',
      variables: [
        { symbol: 'S_base', meaning: 'Baseline minimum taker fee (0.008% / 0.8 bps)' },
        { symbol: 'P_external', meaning: 'Fast-path aggregated median price across global liquidity venues' },
        { symbol: 'P_internal', meaning: 'Internal order book mid-price prior to fill' },
        { symbol: 'λ', meaning: 'Arbitrage capture sensitivity coefficient (calibrated to 0.85)' },
        { symbol: 'σ_instant', meaning: 'Real-time 1-minute realized volatility' },
        { symbol: 'ε', meaning: 'Standard cross-chain networking jitter tolerance window' }
      ]
    },
    keyAdvantages: [
      'Eliminates the structural "toxic flow tax" that quietly drains 3-7% APY from passive LP capital.',
      'Allows Veritas to quote tighter baseline spreads for normal retail traders during calm regimes.',
      'Turns MEV searchers and CEX-DEX arbitrageurs from protocol parasites into major net contributors to LP yield.'
    ],
    hyperliquidContrast: 'Hyperliquid relies on its proprietary validator-managed HLP algorithm to react to price moves. When HLP is slow or wrong, retail depositors bear the full loss, while external HFT firms profit.'
  },
  {
    id: 'cost_plus_fees',
    number: '02',
    title: 'Cost-Plus Zero-Rent Micro-Fee Architecture',
    subtitle: 'Replacing Monopolistic Take-Rates with Democratic Fee Streaming',
    summary: 'Hyperliquid charges between 2.5 and 3.5 basis points on taker trades, accumulating a massive platform surplus in foundation/validator hands. Veritas operates on an open-source "Cost-Plus" utility model: the exchange charges only the minimum necessary to cover compute, security, and LP capital cost, streaming 80% directly to LPs.',
    howItWorks: [
      'Taker fees are dynamically set in the 0.008% – 0.014% band based on current pool utilization.',
      'Fee distribution is hard-coded at the smart contract level: 80% to Liquidity Providers, 10% to Community Insurance Backstop, 10% to Staked Governance Token Burn.',
      'Zero private foundation escrow or discretionary management tax: 100% of non-gas fee cashflow is accounted for in real-time on-chain balances.',
      'Eliminates opaque VIP tier rebates: all users in a given tranche pool enjoy identical fee efficiency regardless of whether they deposit $100 or $100M.'
    ],
    formula: {
      expression: 'Fee_taker = C_infra + R_target / U_pool + S_toxicity',
      description: 'The cost-plus fee equals raw settlement infrastructure cost plus target LP return amortized over pool utilization, adjusted for toxic flow.',
      variables: [
        { symbol: 'C_infra', meaning: 'Zero-knowledge proof verification & DA storage cost (~0.001%)' },
        { symbol: 'R_target', meaning: 'Baseline target yield requirement for passive capital (8-12% APR)' },
        { symbol: 'U_pool', meaning: '24-hour volume-to-liquidity turnover velocity ratio' },
        { symbol: 'S_toxicity', meaning: 'Instantaneous toxicity spread component' }
      ]
    },
    keyAdvantages: [
      'Active traders save an average of 64% in transaction friction compared to Hyperliquid.',
      'High volume prop shops and algorithmic retail traders migrate to Veritas for guaranteed lowest slippage and fee overhead.',
      'Higher trading velocity multiplies total fee volume, generating higher aggregate dollar yield for LPs despite lower percentage fees.'
    ],
    hyperliquidContrast: 'Hyperliquid charges high platform rents to fund its ecosystem treasury and pays negative rebates only to hand-selected institutional market makers.'
  },
  {
    id: 'tuol_tranches',
    number: '03',
    title: 'Transparent User-Owned Liquidity (TUOL) Tranches',
    subtitle: 'Isolated Risk Buckets Replacing Monolithic Counterparty Vaults',
    summary: 'Instead of forcing all retail capital into a single monolithic "HLP" bucket where retail passively absorbs all liquidations and delta risk, Veritas pioneers User-Curated Liquidity Tranches. Depositors choose their exact risk-reward profile with open-source rebalancing rules.',
    howItWorks: [
      'Senior Delta-Neutral Vault: 45% of protocol TVL. Employs automated perpetual basis shorting to neutralize delta risk, delivering steady 12-16% APR with virtually zero liquidation risk.',
      'Dynamic Volatility Grid Vault: 35% of protocol TVL. Runs algorithmic micro-limit orders within dynamic Bollinger ranges around TWAP, capturing wide bid-ask spreads during market oscillations.',
      'Junior Alpha Counterparty Vault: 20% of protocol TVL. Acts as the first-loss absorption buffer for extreme liquidations, earning 1.65x fee share and premium liquidation bonuses (30-45% APR).',
      'Users can inspect every line of strategy code, audit real-time inventory skew, and enter or exit without lockups or hidden withdrawal queues.'
    ],
    formula: {
      expression: 'Yield_tranche = (Fee_share · Multiplier) - Cost_hedge + Skew_PnL + Liquidation_Bonus',
      description: 'Each tranche mathematically decouples fee capture, hedging overhead, and directional inventory skew.',
      variables: [
        { symbol: 'Fee_share', meaning: 'Pro-rata allocation of the 80% protocol fee pool' },
        { symbol: 'Multiplier', meaning: 'Senior (0.70x), Grid (1.15x), Junior (1.65x)' },
        { symbol: 'Cost_hedge', meaning: 'Perpetual funding rate cost for synthetic basis hedge (Senior only)' },
        { symbol: 'Liquidation_Bonus', meaning: '20% protocol liquidation penalty allocated to Junior tranche' }
      ]
    },
    keyAdvantages: [
      'Conservative institutional and treasury capital can safely deposit into Senior Tranches without fear of black-swan wipeouts.',
      'Degens and yield maximizers can deposit into Junior Tranches to capture outsized market-making alpha.',
      'Complete transparency: every rebalance, liquidation, and inventory hedge is verifiable on-chain in real-time.'
    ],
    hyperliquidContrast: 'Hyperliquid gives users a single choice: deposit into HLP or stay out. If HLP suffers an inventory crisis or liquidation cascade, all depositors suffer uniform drawdowns.'
  },
  {
    id: 'modular_settlement',
    number: '04',
    title: 'Modular High-Throughput Execution & Shared Settlement',
    subtitle: 'Zero Cross-Chain Lock-In with Sub-10ms Off-Chain Matching and ZK Verification',
    summary: 'Hyperliquid requires users to bridge funds into a sovereign, non-EVM Tendermint appchain with a small validator consortium. Veritas combines a sub-millisecond Rust matching engine with Zero-Knowledge state diffs settled directly to EVM rollups (Ethereum, Base, Arbitrum) and modular DA (Celestia).',
    howItWorks: [
      'Ultra-fast off-chain order sequencer handles order matching, cancels, and book updates in <5ms with verifiable sequence sequencing.',
      'Every batch of trades generates a STARK/SNARK proof of valid execution, balance conservation, and margin solvency.',
      'State diffs and validity proofs are posted to modular DA and settled canonically to EVM smart contracts.',
      'Users retain native self-custody of their collateral without trusting a proprietary validator set or centralized multisig bridge.'
    ],
    formula: {
      expression: 'Cost_settlement = (Proof_generation_gas + DA_bytes · P_celestia) / N_trades',
      description: 'Batch amortization drops the marginal on-chain cost per trade to under $0.0001, enabling sustainable micro-fees.',
      variables: [
        { symbol: 'Proof_generation_gas', meaning: 'Recursive STARK verification cost amortized over 50,000 trades' },
        { symbol: 'DA_bytes', meaning: 'Compressed state difference payload' },
        { symbol: 'P_celestia', meaning: 'Blobspace pricing on modular data availability layers' },
        { symbol: 'N_trades', meaning: 'Number of matched orders per settlement batch' }
      ]
    },
    keyAdvantages: [
      '100% composable with DeFi: LP tranche tokens can be used as collateral in Morpho, Aave, or automated vaults.',
      'No custom bridge risk: deposits and withdrawals use canonical rollup bridges with cryptographic finality.',
      'Censorship-resistant: if the sequencer goes offline, users can trigger an on-chain escape hatch directly on Ethereum L1.'
    ],
    hyperliquidContrast: 'Hyperliquid operates an isolated appchain where users are locked into its internal ecosystem, unable to use LP shares across Ethereum or other DeFi protocols.'
  }
];
