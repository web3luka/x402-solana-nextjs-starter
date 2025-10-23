import { apiRouteExample, clientComponentExample, walletProviderSetup } from '@/lib/x402-examples';

export default function DocsPage() {
  const examples = [
    { title: 'Server Side - Next.js API Route', code: apiRouteExample, language: 'typescript' },
    { title: 'Client Side - React Component', code: clientComponentExample, language: 'tsx' },
    { title: 'Wallet Provider Setup', code: walletProviderSetup, language: 'tsx' },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">📚 x402 Next.js Starter Documentation</h1>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">What is x402 Protocol?</h2>
          <p className="text-gray-600 mb-4">
            x402 is an HTTP protocol for micropayments without registration. It enables
            instant payments for digital resource access using cryptocurrency wallets.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>⚡ Instant settlements on Solana</li>
            <li>💰 Micropayments from $0.01</li>
            <li>🔒 No registration required</li>
            <li>🔗 PayAI.network integration</li>
          </ul>
        </div>

        <div className="space-y-8">
          {examples.map((example, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-semibold mb-4">{example.title}</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{example.code.trim()}</code>
              </pre>
            </div>
          ))}
        </div>

        <div className="card mt-8">
          <h2 className="text-xl font-semibold mb-4">🚀 Production Deployment</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong>1. Environment setup:</strong> Ensure you have proper PayAI API keys and
              Solana RPC endpoint in environment variables.
            </p>
            <p>
              <strong>2. Security:</strong> Never expose private keys in client-side code.
              Only use environment variables on the server side.
            </p>
            <p>
              <strong>3. Testing:</strong> Test on Solana devnet before deploying to mainnet.
            </p>
            <p>
              <strong>4. Monitoring:</strong> Track transactions and payment errors in application logs.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
