import { NextRequest, NextResponse } from 'next/server';
import { X402PaymentHandler } from '@payai/x402-solana/server';

// Validate environment variables
const TREASURY_ADDRESS = process.env.TREASURY_WALLET_ADDRESS;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const NETWORK = process.env.NEXT_PUBLIC_NETWORK;

if (!TREASURY_ADDRESS || !BASE_URL || !NETWORK) {
  throw new Error('Missing required environment variables');
}

const x402 = new X402PaymentHandler({
  network: NETWORK === 'solana-devnet' ? 'solana-devnet' : 'solana',
  treasuryAddress: TREASURY_ADDRESS,
  facilitatorUrl: 'https://facilitator.payai.network',
});

// Request body validation interface
interface ProtectedRequest {
  action?: string;
  amount?: number;
  currency?: string;
  timestamp?: string;
}

export async function POST(req: NextRequest) {
  try {
    // Validate request body
    let body: ProtectedRequest;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.action || typeof body.action !== 'string') {
      return NextResponse.json(
        { error: 'Action field is required and must be a string' },
        { status: 400 }
      );
    }

    // 1. Extract payment header
    const paymentHeader = x402.extractPayment(req.headers);

    // 2. Create payment requirements
    const paymentRequirements = await x402.createPaymentRequirements({
      price: {
        amount: "10000",  // $0.01 USDC (10,000 micro-units = $0.01)
        asset: {
          address: NETWORK === 'solana-devnet'
            ? 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'  // USDC devnet (faucet)
            : 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mainnet
          decimals: 6  // USDC has 6 decimals
        }
      },
      network: NETWORK === 'solana-devnet' ? 'solana-devnet' : 'solana',
      config: {
        description: 'Protected API Access',
        resource: `${BASE_URL}/api/protected`,
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
      return NextResponse.json(
        { error: 'Invalid or failed payment verification' },
        { status: 402 }
      );
    }

    // 4. Process your business logic
    console.log('Processing protected action:', body.action);

    // 5. Settle payment
    const settlementResult = await x402.settlePayment(paymentHeader, paymentRequirements);

    console.log('Settlement result:', settlementResult);

    // 6. Return response
    return NextResponse.json({
      success: true,
      message: "Access granted after x402 payment!",
      timestamp: new Date().toISOString(),
      data: {
        action: body.action,
        settlementResult,
      },
    });

  } catch (error) {
    console.error('Protected API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
