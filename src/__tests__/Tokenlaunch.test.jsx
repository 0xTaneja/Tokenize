import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { TokenLaunch } from '../components/Tokenlaunch';

// Mock Solana wallet context
vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({ publicKey: 'mockPubkey', sendTransaction: vi.fn() }),
  useConnection: () => ({ connection: {} }),
}));

// Mock spl-token and web3 functions used inside generateToken to avoid heavy deps
vi.mock('@solana/spl-token', () => ({
  MINT_SIZE: 82,
  TOKEN_PROGRAM_ID: {},
  getMinimumBalanceForRentExemptMint: () => Promise.resolve(0),
  getAssociatedTokenAddress: () => Promise.resolve('ata'),
  createAssociatedTokenAccountInstruction: vi.fn(),
  createInitializeMintInstruction: vi.fn(),
  createMintToCheckedInstruction: vi.fn(),
}));
vi.mock('@solana/web3.js', () => ({
  Keypair: { generate: () => ({ publicKey: 'mint', secretKey: new Uint8Array() }) },
  SystemProgram: { createAccount: vi.fn() },
  Transaction: class {
    add() {
      return this;
    }
  },
}));

describe('TokenLaunch', () => {
  it('renders form inputs', () => {
    render(<TokenLaunch />);
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Symbol')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Image')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Initial Supply')).toBeInTheDocument();
  });

  it('updates supply input value', async () => {
    render(<TokenLaunch />);
    const supplyInput = screen.getByPlaceholderText('Initial Supply');
    await userEvent.type(supplyInput, '1000');
    expect(supplyInput).toHaveValue(1000);
  });
});
