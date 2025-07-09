import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, isPlaceholderAddress } from '../config/contracts';

interface PurchaseNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  groupImage: string;
  price: string;
  maxSupply: string;
  currentSupply: string;
  payToken: string;
  provider: ethers.BrowserProvider | null;
  userAddress: string | null;
}

const IP_MODEL_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.IP_MODEL;
// TODO: 需要替换为实际的Marketplace合约地址
// 测试地址 - 请替换为实际部署的 Marketplace 合约地址
const IP_MODEL_MARKETPLACE_ADDRESS = CONTRACT_ADDRESSES.IP_MODEL_MARKETPLACE;

// 完整的 IPModel 合约 ABI
const IPMODEL_ABI = [
  'function mint(address to, uint256 groupId, uint256 amount) external',
  'function getGroupInfo(uint256 groupId) view returns (string, string, uint256, uint256, bool, uint256, address)',
  'function balanceOf(address account, uint256 id) view returns (uint256)',
  'function authorizedMinters(address) view returns (bool)',
  'function owner() view returns (address)',
  'function setApprovalForAll(address operator, bool approved) external',
  'function isApprovedForAll(address account, address operator) view returns (bool)',
];

// 完整的 IPModelMarketplace 合约 ABI
const MARKETPLACE_ABI = [
  'function buyTokens(uint256 groupId, uint256 amount) external',
  'function getGroupDetails(uint256 groupId) view returns (string, string, uint256, uint256, bool, uint256, address)',
  'function ipModelContract() view returns (address)',
  'function recipient() view returns (address)',
  'function owner() view returns (address)',
];

// ERC20 代币 ABI（用于批准支付）
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

const PurchaseNFTModal: React.FC<PurchaseNFTModalProps> = ({
  isOpen,
  onClose,
  groupId,
  groupName,
  groupImage,
  price,
  maxSupply,
  currentSupply,
  payToken,
  provider,
  userAddress,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userBalance, setUserBalance] = useState<string>('0');
  const [latestSupply, setLatestSupply] = useState<string>(currentSupply);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [contractOwner, setContractOwner] = useState<string>('');
  const [useMarketplace, setUseMarketplace] = useState<boolean>(true); // 默认使用 Marketplace
  const [marketplaceAddress, setMarketplaceAddress] = useState<string>('');

  // 检查是否已达到购买上限
  const isSupplyExhausted = parseInt(latestSupply) >= parseInt(maxSupply);
  const availableQuantity = parseInt(maxSupply) - parseInt(latestSupply);
  const maxPurchaseQuantity = Math.min(availableQuantity, 10); // 限制单次最大购买数量

  // 检查是否可以购买
  const canPurchase = () => {
    if (!userAddress || loading || isSupplyExhausted) return false;
    
    // 如果使用 Marketplace，不需要特殊权限
    if (useMarketplace && marketplaceAddress) {
      return true;
    }
    
    // 如果使用直接铸造，需要授权或者是合约所有者
    const isOwner = userAddress.toLowerCase() === contractOwner.toLowerCase();
    return isAuthorized || isOwner;
  };

  // 获取按钮文本
  const getButtonText = () => {
    if (isSupplyExhausted) return '已售罄';
    if (!userAddress) return '请连接钱包';
    if (loading) return '购买中...';
    
    if (useMarketplace && marketplaceAddress) {
      return '立即购买';
    }
    
    // 直接铸造模式
    const isOwner = userAddress.toLowerCase() === contractOwner.toLowerCase();
    if (!isAuthorized && !isOwner) {
      return '无铸造权限';
    }
    
    return '立即购买';
  };

  // 获取用户当前余额和最新供应量
  useEffect(() => {
    const fetchBalanceAndSupply = async () => {
      if (!provider || !userAddress) return;

      try {
        const contract = new ethers.Contract(IP_MODEL_CONTRACT_ADDRESS, IPMODEL_ABI, provider);
        
        // 获取用户余额
        const balance = await contract.balanceOf(userAddress, groupId);
        setUserBalance(balance.toString());

        // 获取最新供应量
        const groupInfo = await contract.getGroupInfo(groupId);
        setLatestSupply(groupInfo[3].toString());

        // 检查用户是否是授权的铸造者
        const authorized = await contract.authorizedMinters(userAddress);
        setIsAuthorized(authorized);

        // 获取合约所有者
        const owner = await contract.owner();
        setContractOwner(owner);

        console.log('User authorization status:', { authorized, owner, userAddress });

        // 尝试验证 Marketplace 地址
        try {
          // 检查是否为占位符地址
          if (isPlaceholderAddress(IP_MODEL_MARKETPLACE_ADDRESS)) {
            console.warn('使用占位符 Marketplace 地址，将使用模拟模式');
            setMarketplaceAddress(IP_MODEL_MARKETPLACE_ADDRESS);
            setUseMarketplace(true);
            return;
          }
          
          // 验证真实的 Marketplace 合约
          const marketplaceContract = new ethers.Contract(IP_MODEL_MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider);
          const ipModelAddr = await marketplaceContract.ipModelContract();
          
          if (ipModelAddr.toLowerCase() === IP_MODEL_CONTRACT_ADDRESS.toLowerCase()) {
            setMarketplaceAddress(IP_MODEL_MARKETPLACE_ADDRESS);
            setUseMarketplace(true);
            console.log('✅ Marketplace 合约验证成功:', IP_MODEL_MARKETPLACE_ADDRESS);
          } else {
            console.warn('❌ Marketplace 合约验证失败: IP Model 地址不匹配');
            setUseMarketplace(false);
          }
        } catch (err) {
          console.warn('❌ Marketplace 合约不可访问:', err);
          setUseMarketplace(false);
        }
      } catch (err) {
        console.error('Failed to fetch balance and supply:', err);
      }
    };

    if (isOpen) {
      fetchBalanceAndSupply();
    }
  }, [isOpen, provider, userAddress, groupId]);

  // 格式化价格
  const formatPrice = (priceWei: string, qty: number) => {
    if (priceWei === '0') return '免费';
    
    try {
      const priceInEther = parseFloat(priceWei) / Math.pow(10, 18);
      const totalPrice = priceInEther * qty;
      return `${totalPrice.toFixed(4)} tokens`;
    } catch (error) {
      return `${priceWei} tokens`;
    }
  };

  // 处理购买
  const handlePurchase = async () => {
    if (!provider || !userAddress) {
      setError('请先连接钱包');
      return;
    }

    if (isSupplyExhausted) {
      setError('该NFT已售罄');
      return;
    }

    if (quantity > maxPurchaseQuantity) {
      setError(`单次购买数量不能超过 ${maxPurchaseQuantity}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const signer = await provider.getSigner();

      if (useMarketplace && marketplaceAddress) {
        // 使用 Marketplace 购买
        console.log('🛒 使用 Marketplace 购买，合约地址:', marketplaceAddress);
        
        // 如果是占位符地址，使用模拟购买
        if (isPlaceholderAddress(marketplaceAddress)) {
          console.log('⚠️ 模拟 Marketplace 购买');
          
          // 模拟购买延迟
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // 模拟购买成功
          console.log('✅ 模拟购买成功');
          
        } else {
          // 真实的 Marketplace 购买
          const marketplaceContract = new ethers.Contract(marketplaceAddress, MARKETPLACE_ABI, signer);

          // 检查是否需要支付代币
          if (price !== '0') {
            const totalPrice = BigInt(price) * BigInt(quantity);
            console.log('💰 计算总价格:', ethers.formatEther(totalPrice.toString()), 'tokens');
            
            // 如果是 ETH 支付 (payToken 为零地址)
            if (payToken === '0x0000000000000000000000000000000000000000') {
              console.log('💳 ETH 支付模式');
              // 由于 buyTokens 是 nonpayable，这里可能需要其他支付方式
              // 检查合约是否有其他支付方法
              try {
                const tx = await marketplaceContract.buyTokens(groupId, quantity);
                console.log('📋 ETH 购买交易已发送:', tx.hash);
                await tx.wait();
                console.log('✅ ETH 购买交易确认');
              } catch (err) {
                console.error('❌ ETH 支付失败:', err);
                setError('ETH 支付失败，请检查合约实现或联系管理员');
                setLoading(false);
                return;
              }
            } else {
              // 代币支付需要先批准
              console.log('🪙 代币支付模式, 代币地址:', payToken);
              try {
                const tokenContract = new ethers.Contract(payToken, ERC20_ABI, signer);
                const allowance = await tokenContract.allowance(userAddress, marketplaceAddress);
                
                if (allowance < totalPrice) {
                  // 需要批准
                  console.log('🔓 需要批准代币支付，数量:', ethers.formatEther(totalPrice.toString()));
                  setError('正在批准代币支付，请在钱包中确认...');
                  
                  const approveTx = await tokenContract.approve(marketplaceAddress, totalPrice);
                  console.log('📋 批准交易已发送:', approveTx.hash);
                  await approveTx.wait();
                  console.log('✅ 代币批准成功');
                  
                  setError(null);
                }
                
                // 执行购买
                console.log('🛍️ 执行代币购买');
                const tx = await marketplaceContract.buyTokens(groupId, quantity);
                console.log('📋 代币购买交易已发送:', tx.hash);
                await tx.wait();
                console.log('✅ 代币购买交易确认');
              } catch (err) {
                console.error('❌ 代币支付失败:', err);
                setError('代币支付失败，请检查余额和授权');
                setLoading(false);
                return;
              }
            }
          } else {
            // 免费 NFT
            console.log('🆓 免费 NFT 购买');
            try {
              const tx = await marketplaceContract.buyTokens(groupId, quantity);
              console.log('📋 免费购买交易已发送:', tx.hash);
              await tx.wait();
              console.log('✅ 免费购买交易确认');
            } catch (err) {
              console.error('❌ 免费购买失败:', err);
              setError('免费购买失败，请稍后重试');
              setLoading(false);
              return;
            }
          }
        }
      } else {
        // 使用直接 mint（需要授权）
        console.log('使用直接 mint');
        
        // 检查用户是否有权限进行铸造
        const isOwner = userAddress.toLowerCase() === contractOwner.toLowerCase();
        if (!isAuthorized && !isOwner) {
          setError('您没有权限铸造此NFT。请使用 Marketplace 购买或联系管理员获取授权。');
          setLoading(false);
          return;
        }

        const contract = new ethers.Contract(IP_MODEL_CONTRACT_ADDRESS, IPMODEL_ABI, signer);

        // 检查是否需要支付代币
        if (price !== '0') {
          setError('直接 mint 不支持付费NFT，请联系管理员');
          setLoading(false);
          return;
        }

        // 执行mint
        console.log('Attempting to mint:', { userAddress, groupId, quantity });
        const tx = await contract.mint(userAddress, groupId, quantity);
        console.log('Mint transaction sent:', tx.hash);
        await tx.wait();
      }
      
      setSuccess(true);
      console.log('Purchase successful!');

      // 更新供应量
      const newSupply = parseInt(latestSupply) + quantity;
      setLatestSupply(newSupply.toString());

      // 2秒后关闭弹窗
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);

    } catch (err: any) {
      console.error('Purchase failed:', err);
      
      // 解析具体的错误信息
      let errorMessage = '购买失败';
      if (err.code === 'ACTION_REJECTED') {
        errorMessage = '交易被用户取消';
      } else if (err.message.includes('insufficient funds')) {
        errorMessage = '钱包余额不足';
      } else if (err.message.includes('unauthorized')) {
        errorMessage = '没有铸造权限';
      } else if (err.message.includes('supply exceeded')) {
        errorMessage = '超过最大供应量';
      } else if (err.message.includes('user rejected')) {
        errorMessage = '用户拒绝了交易';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">购买 NFT</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* NFT预览 */}
          <div className="flex items-center space-x-4">
            <img
              src={groupImage}
              alt={groupName}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{groupName}</h3>
              <p className="text-sm text-gray-600">群组 #{groupId}</p>
            </div>
          </div>

          {/* 供应量信息 */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">已售出:</span>
              <span className="font-medium">{latestSupply} / {maxSupply}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">剩余数量:</span>
              <span className={`font-medium ${availableQuantity <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                {availableQuantity}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">您已拥有:</span>
              <span className="font-medium">{userBalance}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">铸造权限:</span>
              <span className={`font-medium ${isAuthorized || userAddress?.toLowerCase() === contractOwner.toLowerCase() ? 'text-green-600' : 'text-red-600'}`}>
                {isAuthorized || userAddress?.toLowerCase() === contractOwner.toLowerCase() ? '✅ 已授权' : '❌ 未授权'}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">购买方式:</span>
              <span className={`font-medium ${useMarketplace ? 'text-blue-600' : 'text-orange-600'}`}>
                {useMarketplace ? '🛒 Marketplace' : '⚡ 直接铸造'}
                {useMarketplace && isPlaceholderAddress(marketplaceAddress) && (
                  <span className="text-yellow-600 ml-1">(演示模式)</span>
                )}
              </span>
            </div>
            
            {/* 合约地址信息 */}
            {useMarketplace && marketplaceAddress && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">合约地址:</span>
                <span className="font-mono text-xs text-gray-500">
                  {marketplaceAddress.slice(0, 6)}...{marketplaceAddress.slice(-4)}
                </span>
              </div>
            )}
            
            {/* 占位符地址警告 */}
            {useMarketplace && isPlaceholderAddress(marketplaceAddress) && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                ⚠️ 当前使用演示模式，请部署实际的 Marketplace 合约
              </div>
            )}
            
            {/* 真实合约提示 */}
            {useMarketplace && !isPlaceholderAddress(marketplaceAddress) && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                ✅ 已连接到真实的 Marketplace 合约
              </div>
            )}
          </div>

          {/* 购买数量 */}
          {!isSupplyExhausted && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                购买数量
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(maxPurchaseQuantity, parseInt(e.target.value) || 1)))}
                  min="1"
                  max={maxPurchaseQuantity}
                  className="w-20 text-center border border-gray-300 rounded px-2 py-1"
                />
                <button
                  onClick={() => setQuantity(Math.min(maxPurchaseQuantity, quantity + 1))}
                  disabled={quantity >= maxPurchaseQuantity}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                最多可购买 {maxPurchaseQuantity} 个
              </p>
            </div>
          )}

          {/* 价格信息 */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-600">总价:</span>
              <span className="font-bold text-blue-600">
                {formatPrice(price, quantity)}
              </span>
            </div>
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* 成功信息 */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 text-sm">购买成功！</span>
            </div>
          )}

          {/* 供应量警告 */}
          {isSupplyExhausted && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-700 text-sm">该NFT已售罄</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handlePurchase}
            disabled={!canPurchase()}
            className={`flex-1 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center space-x-2 ${
              !canPurchase()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-pink-600 hover:bg-pink-700'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>购买中...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>{getButtonText()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseNFTModal;
