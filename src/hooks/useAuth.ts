import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'wallet';
  createdAt: Date;
  nftCount: number;
  walletAddress: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const { wallet, connectWallet, disconnectWallet, isConnecting, error: walletError } = useWallet();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const loginWithWallet = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await connectWallet();
    } catch (error) {
      console.error('Wallet login failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const logout = (): void => {
    disconnectWallet();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('user');
  };

  // Update auth state when wallet connection changes
  useEffect(() => {
    if (wallet.isConnected && wallet.address) {
      // Create user from wallet data
      const savedUser = localStorage.getItem('user');
      let user: User;
      
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Update wallet address if it changed
          user = {
            ...parsedUser,
            walletAddress: wallet.address,
            createdAt: new Date(parsedUser.createdAt),
          };
        } catch (error) {
          console.error('Failed to parse saved user:', error);
          user = createNewUser(wallet.address);
        }
      } else {
        user = createNewUser(wallet.address);
      }

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      localStorage.setItem('user', JSON.stringify(user));
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      localStorage.removeItem('user');
    }
  }, [wallet.isConnected, wallet.address]);

  const createNewUser = (address: string): User => ({
    id: address,
    name: `User ${address.slice(0, 6)}...${address.slice(-4)}`,
    email: `${address.slice(0, 8)}@wallet.local`,
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
    provider: 'wallet',
    createdAt: new Date(),
    nftCount: 0, // This would be fetched from the blockchain
    walletAddress: address,
  });

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && wallet.isConnected) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, [wallet.isConnected]);

  return {
    ...authState,
    isLoading: authState.isLoading || isConnecting,
    error: walletError,
    loginWithWallet,
    logout,
    wallet,
  };
};