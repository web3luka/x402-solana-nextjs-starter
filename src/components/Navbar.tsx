'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import Link from 'next/link';

export default function Navbar() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useSolanaWallets();

  if (!ready) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-800">
              x402 Starter
            </Link>
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-800">
            X402 Solana
          </Link>

          <div className="flex items-center space-x-4">
            {!authenticated ? (
              <button
                onClick={login}
                className="btn"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                {wallets.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">
                      {wallets[0].address.slice(0, 6)}...{wallets[0].address.slice(-4)}
                    </span>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Link
                    href="/wallet"
                    className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                  >
                    Wallet
                  </Link>
                  <Link
                    href="/protected"
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    Protected
                  </Link>

                  <button
                    onClick={logout}
                    className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
