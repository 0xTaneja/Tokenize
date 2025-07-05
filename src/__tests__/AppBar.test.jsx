import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { AppBar } from '../components/AppBar';

// Mock Solana wallet UI components to avoid DOM errors
vi.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletMultiButton: () => <button>Connect</button>,
  WalletDisconnectButton: () => <button>Disconnect</button>,
}));

describe('AppBar', () => {
  it('renders title', () => {
    render(<AppBar />);
    expect(screen.getByText(/Tokenize/i)).toBeInTheDocument();
  });
});
