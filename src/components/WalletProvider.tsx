'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';

import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProviderWrapper({ children }: WalletProviderProps) {
  const router = useRouter();

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ""}
      config={{
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
