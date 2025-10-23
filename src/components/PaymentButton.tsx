'use client';

import { useState } from 'react';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { createX402Client } from '@payai/x402-solana/client';

interface PaymentButtonProps {
  amount?: number;
  currency?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: string) => void;
  children: React.ReactNode;
}

export default function PaymentButton({
  amount = 0.01,
  currency = 'USD',
  onSuccess,
  onError,
  children
}: PaymentButtonProps) {
  const { wallets } = useSolanaWallets();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    const wallet = wallets[0];
    if (!wallet) {
      onError?.('Please connect your Solana wallet first');
      return;
    }

    setLoading(true);

    try {
      // Create x402 client with Privy wallet
      const client = createX402Client({
        wallet: wallet,
        network: process.env.NEXT_PUBLIC_NETWORK === 'solana-devnet' ? 'solana-devnet' : 'solana',
        maxPaymentAmount: BigInt(10_000_000), // Max payment amount
      });

      // Make a paid request - x402 should handle ATA creation automatically
      const response = await client.fetch('/api/protected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'premium_feature',
          amount,
          currency,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        onSuccess?.(result);
      } else {
        onError?.(result.error || 'Payment failed');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !wallets.length}
      className="btn disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : children}
    </button>
  );
}
