'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

interface WalletProviderProps {
  children: ReactNode;
}

const solanaDevnet = {
  id: 103, // Solana devnet chain ID
  name: 'Solana Devnet',
  network: 'solana-devnet',
  nativeCurrency: {
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_SOLANA_RPC_DEVNET || 'https://api.devnet.solana.com'],
    },
  },
  testnet: true,
};

const solanaMainnet = {
  id: 101, // Solana mainnet chain ID
  name: 'Solana Mainnet',
  network: 'solana-mainnet',
  nativeCurrency: {
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_SOLANA_RPC_MAINNET || 'https://api.mainnet-beta.solana.com'],
    },
  },
  testnet: false,
};


export function WalletProviderWrapper({ children }: WalletProviderProps) {
  const router = useRouter();

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ""}
      config={{
        solanaClusters: [
          {
            name: 'mainnet-beta',
            rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_MAINNET || 'https://api.mainnet-beta.solana.com',
          },
          {
            name: 'devnet',
            rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_DEVNET || 'https://api.devnet.solana.com',
          },
        ],
        defaultChain: solanaDevnet,
        supportedChains: [solanaDevnet, solanaMainnet],
        // Enable Solana
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: true,
        },

        // Login methods
        loginMethods: ["wallet", "email", "sms"],

        // Appearance
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          showWalletLoginFirst: true,
          walletChainType: "solana-only",
        },

        // External wallets
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
