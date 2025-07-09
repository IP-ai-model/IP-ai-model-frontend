import React, { useState } from 'react';
import { User, Settings, LogOut, Wallet, Shield, Calendar, Zap, Camera, Edit3, Image, Star, Copy, ExternalLink } from 'lucide-react';
import { User as UserType } from '../hooks/useAuth';
import AvatarEditor from './AvatarEditor';

interface UserMenuProps {
  user: UserType | null;
  isAuthenticated: boolean;
  onLoginWithWallet: () => void;
  onLogout: () => void;
  isLoading: boolean;
  error: string | null;
}

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  isAuthenticated,
  onLoginWithWallet,
  onLogout,
  isLoading,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingNickname, setEditingNickname] = useState(false);
  const [nickname, setNickname] = useState(user?.name || '');
  const [copied, setCopied] = useState(false);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(user?.avatar || '');

  const handleWalletLogin = () => {
    onLoginWithWallet();
    setIsOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    setShowSettings(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCurrentAvatar(result);
        // In a real app, you'd upload to IPFS or decentralized storage
        console.log('Avatar uploaded to local storage');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSave = (newAvatar: string) => {
    setCurrentAvatar(newAvatar);
    // In a real app, you'd save to IPFS and update user profile on-chain
    console.log('Avatar saved:', newAvatar.substring(0, 50) + '...');
  };

  const handleNicknameEdit = () => {
    setEditingNickname(true);
    setNickname(user?.name || '');
  };

  const handleNicknameSave = () => {
    // In a real app, you'd update the user profile on-chain or in decentralized storage
    console.log('Nickname updated:', nickname);
    setEditingNickname(false);
  };

  const copyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400/20 to-gray-300/20 flex items-center justify-center hover:from-gray-400/30 hover:to-gray-300/30 transition-all duration-300"
        >
          <User className="w-5 h-5 text-gray-600" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-gray/20 shadow-2xl p-6 z-50">
            <div className="text-center">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
              <p className="text-sm text-gray-700 mb-6">Connect your MetaMask wallet to access Melodyn and your NFTs</p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <button
                onClick={handleWalletLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500/20 to-orange-400/20 border border-gray-300 rounded-xl py-3 px-4 text-sm font-medium text-gray-800 hover:from-orange-500/30 hover:to-orange-400/30 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Connect MetaMask</span>
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-500 mt-4">
                Don't have MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Download here</a>
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-pink-500/50 transition-all duration-300"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-gray-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-pink-600" />
          </div>
        )}
      </button>

      {isOpen && !showSettings && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-2xl p-4 z-50">
          <div className="flex items-center space-x-3 mb-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-gray-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-pink-600" />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{user?.name}</h4>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-700 font-mono">{user?.walletAddress ? formatAddress(user.walletAddress) : ''}</p>
                <button
                  onClick={copyAddress}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Copy address"
                >
                  <Copy className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          
          {copied && (
            <div className="mb-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-xs text-green-600 text-center">Address copied to clipboard!</p>
            </div>
          )}
          
          <div className="space-y-2">
            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            
            <button
              onClick={() => window.open(`https://etherscan.io/address/${user?.walletAddress}`, '_blank')}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on Etherscan</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect Wallet</span>
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="absolute right-0 top-full mt-2 w-[480px] bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 z-50 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Wallet Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Avatar Upload Section */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Avatar</h4>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {currentAvatar ? (
                    <img
                      src={currentAvatar}
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-gray-500/20 flex items-center justify-center">
                      <User className="w-10 h-10 text-pink-600" />
                    </div>
                  )}
                  <button
                    onClick={() => setShowAvatarEditor(true)}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-pink-500/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-500 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-2">Customize your avatar with our editor</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowAvatarEditor(true)}
                      className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-gray-500/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-medium text-gray-700 hover:from-pink-500/30 hover:to-gray-500/30 transition-all duration-300 flex items-center space-x-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Avatar</span>
                    </button>
                    <label className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-blue-400/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-medium text-gray-700 hover:from-blue-500/30 hover:to-blue-400/30 transition-all duration-300 cursor-pointer flex items-center space-x-1">
                      <Image className="w-3 h-3" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Nickname Section */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Display Name</h4>
              <div className="flex items-center space-x-3">
                {editingNickname ? (
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-pink-500"
                      placeholder="Enter your display name"
                    />
                    <button
                      onClick={handleNicknameSave}
                      className="px-3 py-2 bg-gradient-to-r from-green-500/20 to-green-400/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-medium text-green-600 hover:from-green-500/30 hover:to-green-400/30 transition-all duration-300"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingNickname(false)}
                      className="px-3 py-2 bg-gradient-to-r from-gray-500/20 to-gray-400/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-medium text-gray-600 hover:from-gray-500/30 hover:to-gray-400/30 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-900">{user?.name}</span>
                    <button
                      onClick={handleNicknameEdit}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Wallet Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Wallet Information</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Wallet Address</p>
                      <p className="text-xs text-gray-700 font-mono">{user?.walletAddress}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyAddress}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy address"
                    >
                      <Copy className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => window.open(`https://etherscan.io/address/${user?.walletAddress}`, '_blank')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View on Etherscan"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Owned NFTs Section */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Owned NFTs</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-pink-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">DreamLicense NFTs</p>
                      <p className="text-xs text-gray-700">{user?.nftCount || 0} owned</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-gray-500/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-medium text-gray-700 hover:from-pink-500/30 hover:to-gray-500/30 transition-all duration-300">
                    View All
                  </button>
                </div>
                
                {/* Mock NFT Preview */}
                {user?.nftCount && user.nftCount > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <img
                        src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="Aurora Dream"
                        className="w-full h-16 object-cover rounded-lg mb-2"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-800">Aurora Dream</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-700">#1</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <img
                        src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="Luna Mystery"
                        className="w-full h-16 object-cover rounded-lg mb-2"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-800">Luna Mystery</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-700">#2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Account Details</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-700" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Connected Since</p>
                    <p className="text-xs text-gray-700">{user ? formatDate(user.createdAt) : ''}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Zap className="w-4 h-4 text-pink-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Owned NFTs</p>
                    <p className="text-xs text-gray-700">{user?.nftCount || 0} DreamLicense NFTs</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Privacy Status</p>
                    <p className="text-xs text-gray-700">Zero-Knowledge Protected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/10">
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500/20 to-red-400/20 backdrop-blur-sm border border-white/30 rounded-xl py-3 px-4 text-sm font-medium text-red-600 hover:from-red-500/30 hover:to-red-400/30 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect Wallet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Editor Modal */}
      {showAvatarEditor && (
        <AvatarEditor
          currentAvatar={currentAvatar}
          onSave={handleAvatarSave}
          onClose={() => setShowAvatarEditor(false)}
        />
      )}
    </div>
  );
};

export default UserMenu;