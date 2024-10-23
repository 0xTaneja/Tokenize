import { WalletMultiButton,WalletDisconnectButton } from "@solana/wallet-adapter-react-ui"
export function AppBar()
{
    return (
        <div className="border-b flex justify-between px-10 py-4">
        <div className="flex flex-col justify-center font-semibold text-xl">
            Tokenize
        </div>
        <div className="flex space-x-4">
         <WalletMultiButton/>
        
         <WalletDisconnectButton/>
        
        </div>
        </div>
    )
}