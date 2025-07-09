import React from 'react';
import { Shield, Lock, Eye, Key, Server, Zap } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 mx-auto mb-4 text-pink-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-gray-600 bg-clip-text text-transparent mb-4">
            Zero-Knowledge Privacy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Military-grade privacy protection using zero-knowledge proofs for complete anonymity and security
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Privacy Guarantees</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Lock className="w-6 h-6 text-pink-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">End-to-End Encryption</h3>
                  <p className="text-sm text-gray-600">All interactions are encrypted before leaving your device and can only be decrypted by your AI companion</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Eye className="w-6 h-6 text-pink-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Zero-Knowledge Proofs</h3>
                  <p className="text-sm text-gray-600">Verify interactions without revealing any sensitive information to third parties</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Key className="w-6 h-6 text-pink-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Private Key Control</h3>
                  <p className="text-sm text-gray-600">You maintain complete control over your private keys and encrypted data</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Technical Security</h2>
            <div className="space-y-4">
              <div className="bg-gray-900/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Encryption Strength</span>
                  <span className="text-sm text-pink-600">AES-256</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-green-500 to-green-400"></div>
                </div>
              </div>
              
              <div className="bg-gray-900/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Zero-Knowledge Proof</span>
                  <span className="text-sm text-pink-600">zk-SNARKs</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-400"></div>
                </div>
              </div>
              
              <div className="bg-gray-900/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Decentralized Storage</span>
                  <span className="text-sm text-pink-600">IPFS</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-purple-500 to-purple-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Privacy Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Server className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Data Sovereignty</h3>
              <p className="text-sm text-gray-600">Your data never leaves your control</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Instant Verification</h3>
              <p className="text-sm text-gray-600">Real-time ZK proof validation</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Anonymous Access</h3>
              <p className="text-sm text-gray-600">No personal data collection</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-gradient-to-r from-pink-500/20 to-gray-500/20 backdrop-blur-sm border border-white/30 rounded-xl py-4 px-8 text-lg font-medium text-gray-700 hover:from-pink-500/30 hover:to-gray-500/30 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-pink-500/20">
            Configure Privacy Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;