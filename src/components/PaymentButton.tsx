'use client';

import { useState } from 'react';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { createX402Client } from '@payai/x402-solana/client';

interface PaymentButtonProps {
  amount?: number;
  currency?: string;
  onSuccess?: (response: unknown) => void;
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
      console.log('Processing payment...');
      
      // Create x402 client with default RPC from environment
      const client = createX402Client({
        wallet: wallet,
        network: process.env.NEXT_PUBLIC_NETWORK === 'solana-devnet' ? 'solana-devnet' : 'solana',
        maxPaymentAmount: BigInt(10_000_000),
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
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onError?.(errorMessage);
    }
    
    setLoading(false);
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
