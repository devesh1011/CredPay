// Creditcoin  Network Configuration
export const CREDITCOIN_NETWORKS = {
  mainnet: {
    chainId: 102030, // TODO: Find mainnet chainId
    chainName: "Creditcoin ",
    nativeCurrency: {
      name: "Creditcoin ",
      symbol: "CTC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.cc3-mainnet.creditcoin.network"], // TODO: Find mainnet rpc
    blockExplorerUrls: ["https://creditcoin.blockscout.com"], // TODO: Find mainnet explorer
  },
  testnet: {
    chainId: 102031,
    chainName: "Creditcoin  Testnet",
    nativeCurrency: {
      name: "Creditcoin ",
      symbol: "tCTC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.cc3-testnet.creditcoin.network/"],
    blockExplorerUrls: ["https://creditcoin-testnet.blockscout.com"], // TODO: Find testnet explorer
  },
} as const;

// Default to testnet for development
export const DEFAULT_NETWORK =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet"
    ? CREDITCOIN_NETWORKS.mainnet
    : CREDITCOIN_NETWORKS.testnet;

// Transaction status constants
export const TX_STATUS = {
  IDLE: "idle",
  PENDING: "pending",
  CONFIRMING: "confirming",
  CONFIRMED: "confirmed",
  FAILED: "failed",
} as const;

// Default payment amounts
export const DEFAULT_PAYMENT_AMOUNTS = [
  { value: "0.1", label: "Coffee ☕", usd: "~$5" },
  { value: "0.2", label: "Lunch 🍱", usd: "~$10" },
  { value: "0.5", label: "Dinner 🍽️", usd: "~$25" },
  { value: "1", label: "Premium 💎", usd: "~$50" },
  { value: "2", label: "Generous 🎁", usd: "~$100" },
  { value: "5", label: "Supporter 🚀", usd: "~$250" },
] as const;

// Wallet connector configurations
export const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

// Explorer URLs
export const getExplorerUrl = (hash: string, type: "tx" | "address" = "tx") => {
  const baseUrl = DEFAULT_NETWORK.blockExplorerUrls[0];
  return `${baseUrl}/${type}/${hash}`;
};

// Chain helpers
export const isCreditcoinNetwork = (chainId: number | undefined) => {
  if (!chainId) return false;
  return (
    chainId === CREDITCOIN_NETWORKS.mainnet.chainId ||
    chainId === CREDITCOIN_NETWORKS.testnet.chainId
  );
};

export const getCreditcoinNetwork = (chainId: number | undefined) => {
  if (chainId === CREDITCOIN_NETWORKS.mainnet.chainId)
    return CREDITCOIN_NETWORKS.mainnet;
  if (chainId === CREDITCOIN_NETWORKS.testnet.chainId)
    return CREDITCOIN_NETWORKS.testnet;
  return null;
};
