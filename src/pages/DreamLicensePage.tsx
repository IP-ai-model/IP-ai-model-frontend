import React from 'react';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useDreamLicenseNFTs } from '../hooks/useDreamLicenseNFTs';
import { useZKProof } from '../hooks/useZKProof';
import WalletConnection from '../components/WalletConnection';
import NFTSelector from '../components/NFTSelector';
import ZKVerification from '../components/ZKVerification';
import VerifiedChatInterface from '../components/VerifiedChatInterface';
import { DreamLicenseNFT, VerificationData } from '../types/dreamlicense';

const DreamLicensePage: React.FC = () => {
  const { wallet, connectWallet, disconnectWallet, isConnecting, error: walletError } = useWallet();
  const { nfts, loading: nftsLoading, error: nftsError, refetch } = useDreamLicenseNFTs(wallet.provider, wallet.address);
  const { proof, isGenerating, error: proofError, generateProof, clearProof } = useZKProof();
  
  const [selectedNFT, setSelectedNFT] = useState<DreamLicenseNFT | null>(null);
  const [chatSession, setChatSession] = useState<VerificationData | null>(null);

  const handleNFTSelect = (nft: DreamLicenseNFT) => {
    setSelectedNFT(nft);
    clearProof();
  };

  const handleGenerateProof = async () => {
    if (!selectedNFT || !wallet.address) return;
    await generateProof(wallet.address, selectedNFT.tokenId);
  };

  const handleStartChat = () => {
    if (!selectedNFT || !wallet.address || !proof) return;
    
    const verificationData: VerificationData = {
      walletAddress: wallet.address,
      nftId: selectedNFT.tokenId,
      zkProof: proof,
      timestamp: Date.now(),
    };
    
    setChatSession(verificationData);
  };

  const handleEndSession = () => {
    setChatSession(null);
    setSelectedNFT(null);
    clearProof();
  };

  // If in chat session, show the verified chat interface
  if (chatSession && selectedNFT) {
    return (
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-pink-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-gray-600 bg-clip-text text-transparent mb-2">
              Verified Chat Session
            </h1>
            <p className="text-gray-600">
              Private conversation with {selectedNFT.metadata.name}
            </p>
          </div>
          
          <VerifiedChatInterface
            verificationData={chatSession}
            companionName={selectedNFT.metadata.name}
            companionImage={selectedNFT.metadata.image}
            onEndSession={handleEndSession}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-pink-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-gray-600 bg-clip-text text-transparent mb-4">
            DreamLicense NFTs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your DreamLicense NFTs with zero-knowledge verification
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1: Connect Wallet */}
          <WalletConnection
            isConnected={wallet.isConnected}
            address={wallet.address}
            isConnecting={isConnecting}
            error={walletError}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
          />

          {/* Conditional content based on connected wallet */}
          {wallet.isConnected && (
            <>
              {/* 简单的群组信息概览 */}
              <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">IP Model 群组概览</h3>
                <div className="text-xs text-gray-600">
                  连接钱包后可查看详细的群组类型和NFT信息
                </div>
              </div>
              
              {/* Step 2: Select NFT (only show if wallet connected) */}
              <NFTSelector
                nfts={nfts}
                loading={nftsLoading}
                error={nftsError}
                selectedNFT={selectedNFT}
                onSelect={handleNFTSelect}
                onRefetch={refetch}
              />

              {/* Step 3: ZK Verification (only show if NFT selected) */}
              {selectedNFT && wallet.address && (
                <ZKVerification
                  selectedNFT={selectedNFT}
                  walletAddress={wallet.address}
                  proof={proof}
                  isGenerating={isGenerating}
                  error={proofError}
                  onGenerateProof={handleGenerateProof}
                  onStartChat={handleStartChat}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DreamLicensePage;