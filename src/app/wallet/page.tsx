'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';

export default function WalletPage() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useSolanaWallets();

  if (!ready) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          🪙 Solana Wallet Integration with Privy
        </h1>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>

          <div className="flex flex-col items-center space-y-4">
            {!authenticated ? (
              <button
                onClick={login}
                className="btn"
              >
                Login with Privy
              </button>
            ) : (
              <div className="w-full space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-green-800 font-semibold mb-2">✅ Connected</h3>
                  <p className="text-green-700 text-sm">
                    User ID: {user?.id}
                  </p>
                  {wallets.length > 0 && (
                    <p className="text-green-700 text-sm">
                      Solana Wallet: {wallets[0].address.slice(0, 8)}...{wallets[0].address.slice(-8)}
                    </p>
                  )}
                </div>

                <button
                  onClick={logout}
                  className="btn bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            )}

            {!authenticated && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-full text-center">
                <p className="text-yellow-700">
                  Connect with Privy to access Solana wallets and x402 features
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">How it works?</h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <strong>1. Login with Privy:</strong> Use the button above to authenticate
              with email, wallet, or SMS.
            </p>
            <p>
              <strong>2. Embedded Wallets:</strong> Privy automatically creates Solana wallets
              for users without existing ones.
            </p>
            <p>
              <strong>3. Micropayments:</strong> When you visit a protected endpoint,
              you will be asked to approve a micropayment ($0.01).
            </p>
            <p>
              <strong>4. Instant settlements:</strong> Payments are settled instantly
              on Solana blockchain through PayAI.network.
            </p>
            <p>
              <strong>5. No registration:</strong> Seamless authentication with multiple methods.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
