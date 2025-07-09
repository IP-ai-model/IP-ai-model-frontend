import { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    provider: null,
    signer: null,
    chainId: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const provider = await detectEthereumProvider();
      if (!provider) {
        throw new Error('MetaMask not detected. Please install MetaMask.');
      }

      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const accounts = await ethersProvider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }

      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const network = await ethersProvider.getNetwork();

      setWallet({
        isConnected: true,
        address,
        provider: ethersProvider,
        signer,
        chainId: Number(network.chainId),
      });

    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      provider: null,
      signer: null,
      chainId: null,
    });
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const provider = await detectEthereumProvider();
        if (provider) {
          const ethersProvider = new ethers.BrowserProvider(provider as any);
          const accounts = await ethersProvider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = await ethersProvider.getSigner();
            const address = await signer.getAddress();
            const network = await ethersProvider.getNetwork();

            setWallet({
              isConnected: true,
              address,
              provider: ethersProvider,
              signer,
              chainId: Number(network.chainId),
            });
          }
        }
      } catch (err) {
        console.error('Failed to check wallet connection:', err);
      }
    };

    checkConnection();
  }, []);

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    isConnecting,
    error,
  };
};