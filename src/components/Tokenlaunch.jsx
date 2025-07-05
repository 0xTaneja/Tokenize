import { useState } from 'react';
import { Svgcomp } from './SvgComp';
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
} from '@solana/spl-token';
import { Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export function TokenLaunch() {
  /* eslint-disable no-unused-vars */
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenImageUrl, setTokenImageUrl] = useState('');
  const [tokensupply, settokensupply] = useState(0);
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [txSig, setTxSig] = useState('');
  /* eslint-enable no-unused-vars */

  async function generateToken() {
    if (!wallet.publicKey) {
      alert('Connect wallet first');
      return;
    }

    setLoading(true);
    try {
      const mint = Keypair.generate();

      // 1. Create the new mint account & initialize it
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      const createMintAccountIx = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      });

      const initMintIx = createInitializeMintInstruction(
        mint.publicKey,
        9, // decimals
        wallet.publicKey, // mint authority
        wallet.publicKey, // freeze authority
      );

      // 2. Associated Token Account for creator
      const ata = await getAssociatedTokenAddress(mint.publicKey, wallet.publicKey);
      const ataIx = createAssociatedTokenAccountInstruction(
        wallet.publicKey, // payer
        ata, // ATA address
        wallet.publicKey, // owner
        mint.publicKey, // mint
      );

      // 3. Mint initial supply
      const supply = BigInt(tokensupply || 0) * BigInt(10 ** 9);
      const mintToIx = createMintToCheckedInstruction(
        mint.publicKey, // mint
        ata, // destination (ATA)
        wallet.publicKey, // authority
        supply,
        9, // decimals must match mint
      );

      // Combine into single Tx
      const tx = new Transaction().add(createMintAccountIx, initMintIx, ataIx, mintToIx);
      const signature = await wallet.sendTransaction(tx, connection, { signers: [mint] });
      await connection.confirmTransaction(signature, 'confirmed');

      setTxSig(signature);
    } catch (err) {
      console.error(err);
      alert('Transaction failed – see console');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center flex-col">
      <div className="flex justify-center text-2xl font-semibold pt-20">
        Create Solana Tokens in One Go
      </div>

      <div className=" flex flex-col items-center  ">
        <input
          type="text"
          id="tname"
          onChange={(e) => setTokenName(e.target.value)}
          className="input mt-4"
          placeholder="Name"
        />
        <input
          type="text"
          id="tsym"
          onChange={(e) => setTokenSymbol(e.target.value)}
          className="input mt-4"
          placeholder="Symbol"
        />
        <input
          type="text"
          id="timg"
          onChange={(e) => setTokenImageUrl(e.target.value)}
          className="input mt-4"
          placeholder="Image"
        />
        <input
          type="number"
          min="0"
          id="isup"
          onChange={(e) => settokensupply(e.target.value)}
          className="input mt-4"
          placeholder="Initial Supply"
          required
        />
      </div>
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={generateToken}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            'Creating…'
          ) : (
            <>
              <Svgcomp />
              Create Token
            </>
          )}
        </button>
      </div>

      {txSig && (
        <div className="text-center mt-4">
          ✅ Token minted! View tx:&nbsp;
          <a
            href={`https://explorer.solana.com/tx/${txSig}?cluster=${import.meta.env.VITE_SOLANA_NETWORK || 'devnet'}`}
            className="text-blue-600 underline"
            target="_blank"
            rel="noreferrer"
          >
            {txSig.slice(0, 6)}…
          </a>
        </div>
      )}
    </div>
  );
}
