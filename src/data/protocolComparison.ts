import { ComparisonDimension, SimulationPreset } from '../types';

export const COMPARISON_DIMENSIONS: ComparisonDimension[] = [
  {
    id: 'liquidity_architecture',
    title: 'Liquidity Pool Architecture & Ownership',
    hyperliquidApproach: {
      label: 'Single HLP Counterparty Vault (Semi-Black Box)',
      description: 'Depositors contribute USDC to a monolithic HLP (Hyperliquidity Provider) pool. A proprietary off-chain/native market-making algorithm quotes bids and asks, manages liquidation flow, and absorbs market skew.',
      vulnerability: 'Retail LPs cannot inspect real-time risk parameters, select custom market-making strategies, or isolate their capital from systemic market-wide liquidations and toxic flow.'
    },
    veritasApproach: {
      label: 'Transparent User-Owned Liquidity (TUOL) Tranches',
      description: 'Multi-tranche open liquidity architecture: Senior (delta-hedged principal-protected), Dynamic Volatility Grid (range-bound maker), and Junior Alpha (first-loss high yield). All strategy formulas run verifiably on-chain.',
      advantage: '100% transparent on-chain risk isolation. Users choose their risk appetite, audit exact rebalancing math, and earn direct fee streaming without opaque platform intermediation.'
    },
    metricImpact: '95% reduction in unexplained LP drawdown risk via isolated tranche boundaries'
  },
  {
    id: 'fee_structure',
    title: 'Fee Economics & Value Capture',
    hyperliquidApproach: {
      label: 'Monopolistic Rent Extraction (2.5 – 3.5 bps)',
      description: 'Standard taker fees average 0.025% – 0.035%. A majority of fee revenue is retained in protocol foundation reserves, validator incentives, and future token buybacks, rather than flowing directly to active liquidity providers.',
      vulnerability: 'Extracts platform rent from retail traders while heavily subsidizing high-frequency trading (HFT) institutional makers with negative maker rebates.'
    },
    veritasApproach: {
      label: 'Cost-Plus Zero-Rent Micro-Fees (0.8 – 1.4 bps)',
      description: 'Dynamic cost-plus fee engine setting taker fees at 0.008% – 0.014% (over 60% cheaper for traders). 80% is paid directly to user-owned liquidity providers, 10% to community insurance, and 10% to token burn.',
      advantage: 'Traders save up to $200 per $1M traded; LPs earn higher net APR through higher capital utilization and direct cashflow distribution.'
    },
    metricImpact: '64% lower transaction friction for active traders with 2.2x fee pass-through to LPs'
  },
  {
    id: 'lvr_toxic_flow',
    title: 'Toxic Flow & Loss-Versus-Rebalancing (LVR)',
    hyperliquidApproach: {
      label: 'Passive Absorption of Latency Arbitrage',
      description: 'HLP serves as the universal passive counterparty. When external CEXs (Binance, Bybit) move first, external arbitrageurs pick off stale orders on the book, transferring value from HLP depositors to HFT arbitrageurs.',
      vulnerability: 'LPs suffer continuous LVR (Loss-Versus-Rebalancing) during volatile market regimes, eroding nominal market-making returns.'
    },
    veritasApproach: {
      label: 'Dynamic Toxicity Oracle & LVR Recapture Spread',
      description: 'Instantaneous CEX-DEX latency prober dynamically widens bid-ask spreads during external price dislocations, forcing latency arbitrageurs to pay an adaptive volatility premium that is redirected into LP yield.',
      advantage: 'Recaptures 85%+ of theoretical LVR that would otherwise leak to MEV searchers and CEX-DEX arbitrageurs, preserving LP capital.'
    },
    metricImpact: 'Recaptures an estimated $18M+ annually per $1B daily volume in toxic arbitrage leakage'
  },
  {
    id: 'tokenomics_governance',
    title: 'Protocol Tokenomics & Treasury Accumulation',
    hyperliquidApproach: {
      label: 'Foundation-Centric Capital Accumulation',
      description: 'A significant portion of protocol treasury and sequencer revenue remains controlled by early core contributors and foundation wallets with discretionary buyback/allocation schedules.',
      vulnerability: 'Lack of legal/smart-contract guarantees that protocol cashflows will permanently flow to community token holders or LPs rather than private foundation treasury.'
    },
    veritasApproach: {
      label: '100% Programmatic Cashflow Pass-Through',
      description: 'Smart contracts enforce immutable programmatic cashflow streaming: 0% discretionary foundation tax. Staked governance tokens receive programmatic fee burn and liquidation fee dividends.',
      advantage: 'Constitutional tokenomics: token holders own real economic rights without relying on governance promises or discretionary corporate buybacks.'
    },
    metricImpact: '100% verifiable smart contract revenue distribution with zero discretionary retention'
  },
  {
    id: 'composability_chain',
    title: 'Ecosystem Composability & Chain Sovereignty',
    hyperliquidApproach: {
      label: 'Isolated Appchain Monolith (HyperBFT)',
      description: 'Operates as a sovereign Tendermint-derivative L1 appchain. Assets must cross a custom centralized bridge, isolating liquidity from the broader EVM and DeFi lending ecosystem.',
      vulnerability: 'Bridge vulnerability risk, isolated collateral (cannot use Aave/Morpho LP tokens as collateral), and vendor lock-in to Hyperliquid validator set.'
    },
    veritasApproach: {
      label: 'Modular High-Throughput Rollup + Shared Settlement',
      description: 'Off-chain high-performance order matching engine with zero-knowledge state proofs settled to modular DA (Celestia/EigenDA) and EVM settlement (Ethereum/Base/Arbitrum).',
      advantage: 'Native EVM composability: LP shares can be pledged as money market collateral, staked across DeFi, and bridged trustlessly with native canonical proofs.'
    },
    metricImpact: 'Zero cross-chain bridge lock-in; 100% EVM composability for LP tranche tokens'
  },
  {
    id: 'maker_rebates',
    title: 'Maker Rebate Democracy vs. VIP Gatekeeping',
    hyperliquidApproach: {
      label: 'Tiered VIP Subsidies for Institutional HFTs',
      description: 'Taker fees from retail traders are used to subsidize negative maker fees (-0.001% to -0.003%) reserved strictly for institutional market makers achieving $100M+ monthly volume.',
      vulnerability: 'Retail and smaller liquidity providers are structurally disadvantaged, unable to access negative fee tiers and forced into passive HLP dilution.'
    },
    veritasApproach: {
      label: 'Democratic Pool-Based Maker Yield Sharing',
      description: 'All liquidity placed via User-Owned Pools shares maker rebates equally on a pro-rata basis. No closed-door VIP agreements; any retail user contributing $100 earns identical basis-point efficiency.',
      advantage: 'Eliminates structural advantages for predatory HFTs; levels the playing field for community liquidity providers.'
    },
    metricImpact: 'Zero tiered fee discrimination; equal net basis-point capture for all participants'
  }
];

export const SIMULATION_PRESETS: SimulationPreset[] = [
  {
    id: 'hl_current',
    name: 'Current Hyperliquid Scale',
    description: 'Direct comparison against Hyperliquid current metrics (~$1.5B 24h volume, $500M TVL).',
    dailyVolumeUsd: 1_500_000_000,
    takerFeeBps: 1.2,
    totalLpTvlUsd: 500_000_000,
    marketVolatilityPct: 65,
    toxicFlowPct: 22,
    lvrProtectionEfficiency: 85,
  },
  {
    id: 'high_volatility',
    name: 'High Volatility Regime',
    description: 'Turbulent crypto market regime where toxic flow and arbitrage spikes to 35% of total flow.',
    dailyVolumeUsd: 3_200_000_000,
    takerFeeBps: 1.4,
    totalLpTvlUsd: 650_000_000,
    marketVolatilityPct: 95,
    toxicFlowPct: 35,
    lvrProtectionEfficiency: 88,
  },
  {
    id: 'conservative',
    name: 'Early Scaling Stage',
    description: 'Conservative protocol phase with $300M daily volume and $120M initial user-owned TVL.',
    dailyVolumeUsd: 300_000_000,
    takerFeeBps: 1.0,
    totalLpTvlUsd: 120_000_000,
    marketVolatilityPct: 55,
    toxicFlowPct: 18,
    lvrProtectionEfficiency: 82,
  },
  {
    id: 'market_leader',
    name: 'Top-Tier DEX Supremacy',
    description: 'Mature protocol capturing $6B+ daily volume challenging major centralized exchanges.',
    dailyVolumeUsd: 6_000_000_000,
    takerFeeBps: 0.9,
    totalLpTvlUsd: 1_200_000_000,
    marketVolatilityPct: 70,
    toxicFlowPct: 25,
    lvrProtectionEfficiency: 90,
  }
];
