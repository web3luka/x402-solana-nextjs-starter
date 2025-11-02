# X402 Solana Starter Pack

A comprehensive starter pack for building Next.js applications with x402 protocol micropayments on Solana blockchain using PayAI.network.

**🚀 Perfect for Solana developers who want to monetize their APIs, content, and services with instant USDC micropayments.**

## ✨ What This Starter Pack Includes

- **💰 x402 Protocol Integration** - HTTP 402 micropayments without registration
- **🪙 Full Solana Integration** - Privy wallets, USDC payments, devnet/mainnet support
- **⚡ Next.js 14** - App Router, TypeScript, server components
- **🎨 Modern UI** - Tailwind CSS, responsive design, clean components
- **🔒 Protected Endpoints** - API routes that require payment before access
- **👛 Wallet Management** - Connect, embedded wallets, transaction handling
- **📱 Mobile Ready** - Responsive design that works on all devices

## 🎯 Perfect For

- **API Monetization** - Charge for premium API access
- **Content Platforms** - Paywall articles, videos, premium content
- **AI Services** - Monetize AI API calls, chatbots, data processing
- **Developer Tools** - Paid access to debugging tools, analytics
- **Digital Goods** - NFTs, digital art, software licenses
- **Educational Platforms** - Paid courses, tutorials, certifications

## Features

- ⚡ Next.js 14 with TypeScript
- 🎨 Tailwind CSS
- 💰 x402 Protocol Integration
- 🪙 Solana Web3.js
- 👛 Solana Wallet Adapter
- 🔒 API Endpoint Protection

## Prerequisites

- Node.js 20+ (recommended for optimal performance)
- npm or yarn

## Installation

```bash
npm install
```

## Environment Configuration

Create a `.env.local` file:

```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id-here

# Network Configuration
NODE_ENV=development
NEXT_PUBLIC_NETWORK=solana-devnet

# Treasury wallet address (where payments are sent)
TREASURY_WALLET_ADDRESS=your_treasury_wallet_address_here

# Base URL for resource field
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Running the Application

```bash
npm run dev
```

## Development Scripts

```bash
npm run lint          # Check for linting issues
npm run lint:fix      # Fix linting issues automatically
npm run type-check    # Run TypeScript type checking
npm run clean         # Clean .next build directory
npm run build         # Build for production
```

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── docs/           # Documentation and examples
│   ├── protected/      # Protected endpoint demo
│   └── wallet/         # Solana wallet integration
├── components/          # React components
│   ├── PaymentButton.tsx    # Payment component
│   └── WalletProvider.tsx   # Wallet provider
├── lib/                 # Utility functions
└── middleware.ts        # x402 Middleware
```

## 📚 Documentation

Detailed documentation with code examples is available at `/docs` page after running the application.

## Usage Example

### Protected API Endpoint

```typescript
// POST /api/protected
import { NextRequest, NextResponse } from 'next/server';
import { X402PaymentHandler } from '@payai/x402-solana/server';

const x402 = new X402PaymentHandler({
  network: 'solana-devnet',
  treasuryAddress: process.env.TREASURY_WALLET_ADDRESS!,
  facilitatorUrl: 'https://facilitator.payai.network',
});

export async function POST(req: NextRequest) {
  // Extract payment header
  const paymentHeader = x402.extractPayment(req.headers);

  // Create payment requirements
  const paymentRequirements = await x402.createPaymentRequirements({
    price: {
      amount: "10000",  // $0.01 USDC
      asset: {
        address: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
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
    const response = x402.create402Response(paymentRequirements);
    return NextResponse.json(response.body, { status: response.status });
  }

  // Verify and settle payment
  const verified = await x402.verifyPayment(paymentHeader, paymentRequirements);
  if (!verified) return NextResponse.json({ error: 'Invalid payment' }, { status: 402 });

  await x402.settlePayment(paymentHeader, paymentRequirements);

  return NextResponse.json({ success: true, message: 'Access granted!' });
}
```

### Client Component

```tsx
'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { createX402Client } from '@payai/x402-solana/client';

export default function PaymentButton() {
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

    // Automatically handles 402 payments
    const response = await client.fetch('/api/protected', {
      method: 'POST',
      body: JSON.stringify({ data: 'request' }),
    });

    const result = await response.json();
  };

  return <button onClick={handlePayment}>Pay $0.01</button>;
}
```

## Documentation

- [x402 Protocol](https://payai.network/docs/x402)
- [PayAI.network](https://payai.network)
- [Solana Web3.js](https://docs.solana.com/developing/clients/javascript-api)
