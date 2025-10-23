import type { Metadata } from 'next'
import './globals.css'
import { WalletProviderWrapper } from '@/components/WalletProvider'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'X402 Solana Starter Pack',
  description: 'Build monetized applications on Solana with instant USDC micropayments using x402 protocol',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <WalletProviderWrapper>
          <Navbar />
          {children}
        </WalletProviderWrapper>
      </body>
    </html>
  )
}
