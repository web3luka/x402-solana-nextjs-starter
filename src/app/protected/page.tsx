'use client';

import { useState } from 'react';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { createX402Client } from '@payai/x402-solana/client';

export default function ProtectedPage() {
  const { wallets } = useSolanaWallets();
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testProtectedEndpoint = async () => {
    const wallet = wallets[0];
    if (!wallet) {
      setError('Please connect your Solana wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Create x402 client with Privy wallet
      const client = createX402Client({
        wallet: wallet,
        network: process.env.NEXT_PUBLIC_NETWORK === "solana-devnet"
          ? "solana-devnet"
          : "solana",
        maxPaymentAmount: BigInt(10_000_000), // Max payment amount
      });

      // Make a paid request - x402 automatically handles 402 payments
      const res = await client.fetch('/api/protected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testData: 'This is test data from protected page',
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data);
      } else {
        setError(data.error || 'Request failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          🛡️ Protected Endpoint x402
        </h1>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Protected Endpoint</h2>
          <p className="text-gray-600 mb-4">
            This endpoint requires a $0.01 USDC payment before access.
            When you click the button, x402 will automatically handle the payment
            and you&apos;ll receive the protected data.
          </p>

          <button
            onClick={testProtectedEndpoint}
            disabled={loading || !wallets.length}
            className="btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing payment...' : 'Test Protected Endpoint ($0.01)'}
          </button>

          {!wallets.length && (
            <p className="text-yellow-600 text-sm mt-2">
              ⚠️ Please connect your Solana wallet first using the navbar button.
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-red-800 font-semibold">Error:</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {response && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Response:</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
