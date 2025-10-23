import { NextRequest, NextResponse } from 'next/server';
import { X402PaymentHandler } from '@payai/x402-solana/server';

const x402 = new X402PaymentHandler({
  network: process.env.NEXT_PUBLIC_NETWORK === 'solana-devnet' ? 'solana-devnet' : 'solana',
  treasuryAddress: process.env.TREASURY_WALLET_ADDRESS || 'YourTreasuryAddressHere',
  facilitatorUrl: 'https://facilitator.payai.network',
});

export async function POST(req: NextRequest) {
  // 1. Extract payment header
  const paymentHeader = x402.extractPayment(req.headers);

  // 2. Create payment requirements
  const paymentRequirements = await x402.createPaymentRequirements({
    price: {
      amount: "10000",  // $0.01 USDC (10,000 micro-units = $0.01)
      asset: {
        address: process.env.NEXT_PUBLIC_NETWORK === 'solana-devnet'
          ? 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'  // USDC devnet (faucet)
          : 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mainnet
        decimals: 6  // USDC has 6 decimals
      }
    },
    network: process.env.NEXT_PUBLIC_NETWORK === 'solana-devnet' ? 'solana-devnet' : 'solana',
    config: {
      description: 'Protected API Access',
      resource: `${req.nextUrl.origin}/api/protected` as `${string}://${string}${string}`, // Dynamic URL based on current domain
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

  // 4. Process your business logic
  const body = await req.json();

  // 5. Settle payment
  const settlementResult = await x402.settlePayment(paymentHeader, paymentRequirements);

  console.log('Settlement result:', settlementResult);

  // 6. Return response
  return NextResponse.json({
    success: settlementResult,
    message: "Access granted after x402 payment!",
    timestamp: new Date().toISOString(),
    data: body,
  });
}
