'use client';

import Link from 'next/link'
import { useState } from 'react'
import PaymentButton from '@/components/PaymentButton'
import Modal from '@/components/Modal'

export default function Home() {
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const handlePaymentSuccess = (response: any) => {
    setModal({
      isOpen: true,
      title: 'Payment Successful! 🎉',
      message: `Transaction completed successfully!\n\n${JSON.stringify(response, null, 2)}`,
      type: 'success'
    });
  };

  const handlePaymentError = (error: string) => {
    setModal({
      isOpen: true,
      title: 'Payment Failed',
      message: error,
      type: 'error'
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          🚀 X402 Solana Starter Pack
        </h1>

        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Build monetized applications on Solana with instant USDC micropayments.
          Perfect for APIs, content platforms, AI services, and digital goods.
        </p>

        <div className="grid md:grid-cols-1 gap-8 mb-12">
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">💰 x402 Protocol</h2>
            <p className="text-gray-600 mb-4">
              Integration with x402 protocol for instant micropayments
              without registration.
            </p>
            <Link href="/protected" className="btn inline-block">
              Try protected endpoint
            </Link>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">⚡ Quick payment test</h2>
          <p className="text-gray-600 mb-4">
            Try an x402 micropayment ($0.01) directly from this page.
            Connect your Solana wallet using the button in the navbar.
          </p>
          <PaymentButton
            amount={0.01}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          >
            Pay $0.01 and test
          </PaymentButton>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              🪙 Built for Solana Developers
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              This starter pack is specifically designed for Solana ecosystem.
              Use it to monetize your dApps, APIs, and services with instant USDC micropayments.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-800">Instant Settlements</h3>
                <p className="text-sm text-gray-600">Payments settle in ~2 seconds on Solana</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-semibold text-gray-800">USDC Micropayments</h3>
                <p className="text-sm text-gray-600">$0.01+ payments without gas fees</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl mb-2">🔒</div>
                <h3 className="font-semibold text-gray-800">No Registration</h3>
                <p className="text-sm text-gray-600">HTTP 402 protocol - just pay to access</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card text-center">
          <h2 className="text-2xl font-semibold mb-4">⚡ Quick start</h2>
          <div className="space-y-2 text-left max-w-md mx-auto">
            <p>1. Copy <code className="bg-gray-100 px-2 py-1 rounded">.env.example</code> to <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code></p>
            <p>2. <strong>Get Privy App ID</strong> from <a href="https://dashboard.privy.io" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">dashboard.privy.io</a> and add to <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_PRIVY_APP_ID</code></p>
            <p>3. Run <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code></p>
            <p>4. Done! 🎉</p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </main>
  )
}
