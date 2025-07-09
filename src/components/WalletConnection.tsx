import React from 'react';
import { Wallet, AlertCircle, Loader } from 'lucide-react';

interface WalletConnectionProps {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
  isConnected,
  address,
  isConnecting,
  error,
  onConnect,
  onDisconnect,
}) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Wallet Connected</h3>
              <p className="text-sm text-gray-600">{formatAddress(address)}</p>
            </div>
          </div>
          <button
            onClick={onDisconnect}
            className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-400/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-medium text-red-600 hover:from-red-500/30 hover:to-red-400/30 transition-all duration-300"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-pink-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600 mb-6">
          Connect your MetaMask wallet to access your DreamLicense NFTs
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}
        
        <button
          onClick={onConnect}
          disabled={isConnecting}
          className="w-full bg-gradient-to-r from-pink-500/20 to-gray-500/20 backdrop-blur-sm border border-white/30 rounded-xl py-3 px-4 font-medium text-gray-700 hover:from-pink-500/30 hover:to-gray-500/30 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isConnecting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              <span>Connect MetaMask</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WalletConnection;