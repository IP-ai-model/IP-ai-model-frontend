import React from 'react';
import { Shield, Loader, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { DreamLicenseNFT, ZKProof } from '../types/dreamlicense';

interface ZKVerificationProps {
  selectedNFT: DreamLicenseNFT;
  walletAddress: string;
  proof: ZKProof | null;
  isGenerating: boolean;
  error: string | null;
  onGenerateProof: () => void;
  onStartChat: () => void;
}

const ZKVerification: React.FC<ZKVerificationProps> = ({
  selectedNFT,
  walletAddress,
  proof,
  isGenerating,
  error,
  onGenerateProof,
  onStartChat,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
      <div className="text-center mb-8">
        <Shield className="w-16 h-16 mx-auto mb-4 text-pink-600" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Zero-Knowledge Verification</h2>
        <p className="text-gray-600">
          Generate a privacy-preserving proof to verify your ownership of {selectedNFT.metadata.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Selected NFT</h3>
          <div className="bg-gray-900/10 rounded-xl p-4">
            <div className="flex items-center space-x-4">
              <img
                src={selectedNFT.metadata.image}
                alt={selectedNFT.metadata.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-800">{selectedNFT.metadata.name}</h4>
                <p className="text-sm text-gray-600">Token ID: #{selectedNFT.tokenId}</p>
                <p className="text-xs text-gray-500">{selectedNFT.metadata.personality}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Verification Status</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700">Wallet Connected</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700">NFT Ownership Verified</span>
            </div>
            <div className="flex items-center space-x-3">
              {proof ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : isGenerating ? (
                <Loader className="w-5 h-5 animate-spin text-pink-600" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
              )}
              <span className="text-sm text-gray-700">
                {proof ? 'ZK Proof Generated' : isGenerating ? 'Generating Proof...' : 'ZK Proof Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {proof && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-700">Proof Generated Successfully</span>
          </div>
          <div className="text-xs text-gray-600 font-mono bg-gray-900/10 p-3 rounded-lg">
            <div className="mb-2">
              <strong>Public Signals:</strong>
            </div>
            <div className="space-y-1">
              <div>Wallet: {proof.publicSignals[0]}</div>
              <div>NFT ID: {proof.publicSignals[1]}</div>
              <div>Timestamp: {proof.publicSignals[2]}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        {!proof ? (
          <button
            onClick={onGenerateProof}
            disabled={isGenerating}
            className="flex-1 bg-gradient-to-r from-pink-500/20 to-gray-500/20 backdrop-blur-sm border border-white/30 rounded-xl py-3 px-4 font-medium text-gray-700 hover:from-pink-500/30 hover:to-gray-500/30 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Generating Proof...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Generate ZK Proof</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onStartChat}
            className="flex-1 bg-gradient-to-r from-green-500/20 to-green-400/20 backdrop-blur-sm border border-white/30 rounded-xl py-3 px-4 font-medium text-gray-700 hover:from-green-500/30 hover:to-green-400/30 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-green-500/20 flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Start Verified Chat</span>
          </button>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Your proof is generated locally and ensures complete privacy. No sensitive data is shared.
        </p>
      </div>
    </div>
  );
};

export default ZKVerification;