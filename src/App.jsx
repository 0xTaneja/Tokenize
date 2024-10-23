
import './App.css'
import { TokenLaunch } from './components/Tokenlaunch'
// wallet adapter imports
import { ConnectionProvider,WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { AppBar } from './components/AppBar';

function App() {
  

  return (
    <>
      <div>
        <ConnectionProvider endpoint={"https://solana-devnet.g.alchemy.com/v2/M6gZ-DVd-mKencCSWu6uYX9DTQ3Gou4N"} >
          <WalletProvider wallets={[]}  autoConnect>
            <WalletModalProvider>

               <AppBar/>
               <TokenLaunch/>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
        
      </div>
    </>
  )
}

export default App
