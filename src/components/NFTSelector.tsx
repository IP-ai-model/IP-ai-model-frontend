import React from 'react';
import { Star, Users, Zap, Loader, AlertCircle } from 'lucide-react';
import { DreamLicenseNFT } from '../types/dreamlicense';

interface NFTSelectorProps {
  nfts: DreamLicenseNFT[];
  loading: boolean;
  error: string | null;
  selectedNFT: DreamLicenseNFT | null;
  onSelect: (nft: DreamLicenseNFT) => void;
  onRefetch: () => void;
}

const NFTSelector: React.FC<NFTSelectorProps> = ({
  nfts,
  loading,
  error,
  selectedNFT,
  onSelect,
  onRefetch,
}) => {
  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Your NFTs</h3>
          <p className="text-gray-600">Fetching your DreamLicense collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading NFTs</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onRefetch}
            className="bg-gradient-to-r from-pink-500/20 to-gray-500/20 backdrop-blur-sm border border-white/30 rounded-xl py-2 px-4 text-sm font-medium text-gray-700 hover:from-pink-500/30 hover:to-gray-500/30 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center">
          <Zap className="w-8 h-8 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No DreamLicense NFTs Found</h3>
          <p className="text-gray-600">You don't own any DreamLicense NFTs yet. Visit the marketplace to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your DreamLicense NFT</h2>
        <p className="text-gray-600">Choose which AI companion you'd like to activate</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <div
            key={nft.tokenId}
            onClick={() => onSelect(nft)}
            className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
              selectedNFT?.tokenId === nft.tokenId
                ? 'border-pink-500/50 shadow-2xl shadow-pink-500/20 bg-pink-500/5'
                : 'border-white/20 shadow-xl hover:shadow-pink-500/20'
            }`}
          >
            <div className="relative mb-4 overflow-hidden rounded-xl">
              <img
                src={nft.metadata.image}
                alt={nft.metadata.name}
                className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute top-3 right-3 bg-pink-500/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <Star className="w-3 h-3 text-white" />
                <span className="text-xs text-white font-medium">#{nft.tokenId}</span>
              </div>
              {selectedNFT?.tokenId === nft.tokenId && (
                <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-2">
                    <Zap className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">{nft.metadata.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{nft.metadata.personality}</p>

            <div className="space-y-2">
              {nft.metadata.attributes.slice(0, 3).map((attr, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{attr.trait_type}</span>
                  <span className="text-gray-700 font-medium">{attr.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Token ID</span>
                <span className="font-mono text-pink-600">#{nft.tokenId}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTSelector;