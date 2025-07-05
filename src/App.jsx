import './App.css';
import { TokenLaunch } from './components/Tokenlaunch';
// wallet adapter imports
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  UnsafeBurnerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { AppBar } from './components/AppBar';

function App() {
  const network = import.meta.env.VITE_SOLANA_NETWORK || 'devnet';
  const endpoint = import.meta.env.VITE_RPC_ENDPOINT || clusterApiUrl(network);

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new UnsafeBurnerWalletAdapter(),
  ];

  return (
    <>
      <div>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <AppBar />
              <TokenLaunch />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </div>
    </>
  );
}

export default App;
