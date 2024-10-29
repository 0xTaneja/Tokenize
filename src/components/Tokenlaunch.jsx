import { useRef, useState } from "react"
import { Svgcomp } from "./SvgComp";
import {createInitializeInstruction, createInitializeMetadataPointerInstruction, createInitializeMint2Instruction, createInitializeMintInstruction, createMintToInstruction, ExtensionType, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptMint, getMintLen, LENGTH_SIZE, MINT_SIZE, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, TYPE_SIZE } from "@solana/spl-token";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { pack } from "@solana/spl-token-metadata";

export function TokenLaunch()
{
    const [tokenname,settokenname]=useState("");
    const [tokensymbol,settokensymbol]=useState("");
    const [tokenimageurl,settokenimageurl]=useState("");
    const [tokensupply,settokensupply]=useState(0);
    const {connection}=useConnection();
    const wallet=useWallet();



    async function generateToken()
    {
        
       const mintPair=Keypair.generate();
       const metadata={
        mint:mintPair.publicKey,
        name:tokenname,
        symbol:tokensymbol,
        // uri:tokenimageurl,
        additionalMetadata:[]
       }

       const mintlen=getMintLen([ExtensionType.MetadataPointer]);
       const metadataLen=TYPE_SIZE+LENGTH_SIZE+pack(metadata).length;

       const lamports = await getMinimumBalanceForRentExemptMint(connection);
       if (!wallet || !wallet.publicKey) {
        console.error('Wallet not connected');
        return;
       }
       
       const transaction=new Transaction().add(
        
        SystemProgram.createAccount({
        fromPubkey:wallet.publicKey,
        newAccountPubkey:mintPair.publicKey,
        space:MINT_SIZE,
        lamports,
        programId:TOKEN_PROGRAM_ID
       }),

       createInitializeMetadataPointerInstruction(mintPair.publicKey,wallet.publicKey,mintPair.publicKey,TOKEN_2022_PROGRAM_ID),
       createInitializeMintInstruction(mintPair.publicKey,9,wallet.publicKey,null,TOKEN_2022_PROGRAM_ID),
       createInitializeInstruction({
        programId:TOKEN_2022_PROGRAM_ID,
        mint:mintPair.publicKey,
        metadata:mintPair.publicKey,
        name:metadata.name,
        symbol:metadata.symbol,
        uri:metadata.uri,
        mintAuthority:wallet.publicKey,
        updateAuthority:wallet.publicKey
       }),

    //    createInitializeMint2Instruction(mintPair.publicKey, 9, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID)
    );      

       transaction.feePayer=wallet.publicKey;
       transaction.recentBlockhash=(await connection.getLatestBlockhash()).blockhash;
       transaction.partialSign(mintPair);
       await wallet.sendTransaction(transaction,connection);

       const associatedToken=getAssociatedTokenAddressSync(
        mintPair.publicKey,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
       )
       console.log(associatedToken.toBase58());

       const transaction2=new Transaction().add(
        wallet.publicKey,
        associatedToken,
        wallet.publicKey,
        mintPair.publicKey,
        TOKEN_2022_PROGRAM_ID
       )
       await wallet.sendTransaction(transaction2, connection);

       const transaction3=new Transaction().add(
        createMintToInstruction(mintPair.publicKey,
            associatedToken,
            wallet.publicKey,
            1000000000,
            [],
            TOKEN_2022_PROGRAM_ID
        )
       )
       await wallet.sendTransaction(transaction3, connection);

       console.log("Minted!")

    }

    return (
        <div className="flex justify-center flex-col">
           <div className="flex justify-center text-2xl font-semibold pt-20">
            Create Solana Tokens in One Go
           </div>
         
           <div className=" flex flex-col items-center  ">
            <input type="text" id="tname" onChange={(e)=>settokenname(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 mt-4 w-80" placeholder="Name" required />
            <input type="text" id="tsym" onChange={(e)=>settokensymbol(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 mt-4 w-80" placeholder="Symbol" required />
            <input type="text" id="timg" onChange={(e)=>settokenimageurl(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 mt-4 w-80" placeholder="Image" required />
            <input type="text" id="isup" onChange={(e)=>settokensupply(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 mt-4 w-80" placeholder="Token Supply" required />
           </div>
           <div className="flex justify-center mt-4">
                <button
                    type="button"
                    onClick={generateToken}
                    className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
                >
                   <Svgcomp/>
                   Create Your Own Token
                </button>
            </div>

           
        </div>
    )
}



