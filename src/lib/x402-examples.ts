// src/lib/x402-examples.ts
// Examples of using x402 protocol in Next.js

// 1. Server Side - Next.js API Route
export const apiRouteExample = `
import { NextRequest, NextResponse } from 'next/server';
import { X402PaymentHandler } from '@payai/x402-solana/server';

const x402 = new X402PaymentHandler({
  network: 'solana-devnet',
  treasuryAddress: process.env.TREASURY_WALLET_ADDRESS!,
  facilitatorUrl: 'https://facilitator.payai.network',
});

export async function POST(req: NextRequest) {
  // 1. Extract payment header
  const paymentHeader = x402.extractPayment(req.headers);

  // 2. Create payment requirements
  const paymentRequirements = await x402.createPaymentRequirements({
    price: {
      amount: "10000",  // $0.01 USDC
      asset: {
        address: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr", // USDC devnet (faucet)
        decimals: 6
      }
    },
    network: 'solana-devnet',
    config: {
      description: 'API Access',
      resource: 'http://localhost:3000/api/protected',
    }
  });

  if (!paymentHeader) {
    // Return 402 with payment requirements
    const response = x402.create402Response(paymentRequirements);
    return NextResponse.json(response.body, { status: response.status });
  }

  // 3. Verify payment
  const verified = await x402.verifyPayment(paymentHeader, paymentRequirements);
  if (!verified) {
    return NextResponse.json({ error: 'Invalid payment' }, { status: 402 });
  }

  // 4. Process business logic
  const body = await req.json();

  // 5. Settle payment
  await x402.settlePayment(paymentHeader, paymentRequirements);

  // 6. Return response
  return NextResponse.json({
    success: true,
    message: 'Access granted after payment!',
    data: body,
  });
}
`;

// 2. Client Side - React Component
export const clientComponentExample = `
'use client';

import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { createX402Client } from '@payai/x402-solana/client';

function MyComponent() {
  const { wallets } = useSolanaWallets();

  const handlePayment = async () => {
    const wallet = wallets[0];
    if (!wallet) return;

    // Create x402 client with Privy wallet
    const client = createX402Client({
      wallet: wallet, // Privy wallet is already compatible
      network: 'solana-devnet',
      maxPaymentAmount: BigInt(10_000_000), // Max 10 USDC
    });

    // Make a paid request - automatically handles 402 payments
    const response = await client.fetch('/api/protected', {
      method: 'POST',
      body: JSON.stringify({ data: 'your request' }),
    });

    const result = await response.json();
    console.log('Success:', result);
  };

  return (
    <button onClick={handlePayment}>
      Pay $0.01 and access premium feature
    </button>
  );
}
`;

// 3. Wallet Provider Setup
export const walletProviderSetup = `
'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { solanaDevnet } from '@privy-io/react-auth/solana';

export function WalletProviderWrapper({ children }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        solanaClusters: [
          {
            name: 'devnet',
            rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_DEVNET || 'https://api.devnet.solana.com',
          },
        ],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        loginMethods: ['wallet', 'email', 'sms'],
        defaultChain: solanaDevnet,
      }}
    >
      {children}
    </PrivyProvider>
  );
}
`;

// 4. Environment Variables
export const envExample = `
# Network Configuration
NODE_ENV=development
NEXT_PUBLIC_NETWORK=solana-devnet

# Treasury wallet address (where payments are sent)
TREASURY_WALLET_ADDRESS=your_treasury_wallet_address_here

# Base URL for resource field
NEXT_PUBLIC_BASE_URL=http://localhost:3000
`;

// 5. USDC Mint Addresses
export const usdcAddresses = `
Devnet: Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr (faucet)
Mainnet: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

// Helper for environment-based selection
const USDC_MINT = process.env.NODE_ENV === 'production'
  ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'  // mainnet
  : 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'; // devnet (faucet)
`;
