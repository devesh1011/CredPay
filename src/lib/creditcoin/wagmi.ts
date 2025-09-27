import { createConfig, http, createStorage } from "wagmi";
import { Chain } from "wagmi/chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  argentWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { CREDITCOIN_NETWORKS, WALLET_CONNECT_PROJECT_ID } from "./config";

// Define Creditcoin  Mainnet chain
export const creditcoinMainnet: Chain = {
  id: CREDITCOIN_NETWORKS.mainnet.chainId,
  name: CREDITCOIN_NETWORKS.mainnet.chainName,
  nativeCurrency: CREDITCOIN_NETWORKS.mainnet.nativeCurrency,
  rpcUrls: {
    default: {
      http: CREDITCOIN_NETWORKS.mainnet.rpcUrls,
    },
    public: {
      http: CREDITCOIN_NETWORKS.mainnet.rpcUrls,
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: CREDITCOIN_NETWORKS.mainnet.blockExplorerUrls[0],
    },
  },
  testnet: false,
};

// Define Creditcoin  Testnet chain
export const creditcoinTestnet: Chain = {
  id: CREDITCOIN_NETWORKS.testnet.chainId,
  name: CREDITCOIN_NETWORKS.testnet.chainName,
  nativeCurrency: CREDITCOIN_NETWORKS.testnet.nativeCurrency,
  rpcUrls: {
    default: {
      http: CREDITCOIN_NETWORKS.testnet.rpcUrls,
    },
    public: {
      http: CREDITCOIN_NETWORKS.testnet.rpcUrls,
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: CREDITCOIN_NETWORKS.testnet.blockExplorerUrls[0],
    },
  },
  testnet: true,
};

// Configure wallet connectors
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended for Creditcoin ",
      wallets: [metaMaskWallet, walletConnectWallet, coinbaseWallet],
    },
    {
      groupName: "Other Wallets",
      wallets: [rainbowWallet, argentWallet, trustWallet],
    },
  ],
  {
    appName: "CredPay",
    projectId: WALLET_CONNECT_PROJECT_ID || "CredPay_default_project_id",
  }
);

// Determine which chain to use based on environment
const isMainnet = process.env.NEXT_PUBLIC_NETWORK === "mainnet";
const chains: readonly [Chain, ...Chain[]] = isMainnet
  ? ([creditcoinMainnet] as const)
  : ([creditcoinTestnet] as const);

// Create wagmi config with storage for persistence
export const wagmiConfig = createConfig({
  connectors,
  chains,
  transports: {
    [creditcoinMainnet.id]: http(CREDITCOIN_NETWORKS.mainnet.rpcUrls[0]),
    [creditcoinTestnet.id]: http(CREDITCOIN_NETWORKS.testnet.rpcUrls[0]),
  },
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    key: "CredPay-wallet",
  }),
});
