// 验证 IPModelMarketplace 合约的工具
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../config/contracts';

// 合约 ABI 定义
const MARKETPLACE_ABI = [
  'function ipModelContract() view returns (address)',
  'function recipient() view returns (address)',
  'function owner() view returns (address)',
  'function getGroupDetails(uint256 groupId) view returns (string, string, uint256, uint256, bool, uint256, address)',
  'function buyTokens(uint256 groupId, uint256 amount) external',
];

const IPMODEL_ABI = [
  'function getGroupInfo(uint256 groupId) view returns (string, string, uint256, uint256, bool, uint256, address)',
  'function owner() view returns (address)',
];

// 验证合约配置
export async function verifyContractSetup(provider: ethers.Provider) {
  console.log('🔍 开始验证合约配置...');
  
  try {
    // 验证 IPModel 合约
    console.log('📋 验证 IPModel 合约:', CONTRACT_ADDRESSES.IP_MODEL);
    const ipModelContract = new ethers.Contract(
      CONTRACT_ADDRESSES.IP_MODEL, 
      IPMODEL_ABI, 
      provider
    );
    
    const ipModelOwner = await ipModelContract.owner();
    console.log('✅ IPModel 合约所有者:', ipModelOwner);
    
    // 验证 Marketplace 合约
    console.log('📋 验证 Marketplace 合约:', CONTRACT_ADDRESSES.IP_MODEL_MARKETPLACE);
    const marketplaceContract = new ethers.Contract(
      CONTRACT_ADDRESSES.IP_MODEL_MARKETPLACE, 
      MARKETPLACE_ABI, 
      provider
    );
    
    const marketplaceOwner = await marketplaceContract.owner();
    const recipient = await marketplaceContract.recipient();
    const linkedIPModel = await marketplaceContract.ipModelContract();
    
    console.log('✅ Marketplace 合约所有者:', marketplaceOwner);
    console.log('✅ Marketplace 收款地址:', recipient);
    console.log('✅ Marketplace 关联的 IPModel:', linkedIPModel);
    
    // 验证合约关联
    if (linkedIPModel.toLowerCase() === CONTRACT_ADDRESSES.IP_MODEL.toLowerCase()) {
      console.log('✅ 合约关联验证成功');
    } else {
      console.log('❌ 合约关联验证失败');
      console.log('期望:', CONTRACT_ADDRESSES.IP_MODEL);
      console.log('实际:', linkedIPModel);
    }
    
    // 测试群组信息获取
    console.log('📋 测试群组信息获取...');
    try {
      const groupInfo = await ipModelContract.getGroupInfo(1);
      console.log('✅ 群组 1 信息:', {
        name: groupInfo[0],
        description: groupInfo[1],
        maxSupply: groupInfo[2].toString(),
        currentSupply: groupInfo[3].toString(),
        isActive: groupInfo[4],
        price: groupInfo[5].toString(),
        payToken: groupInfo[6]
      });
      
      // 同时从 Marketplace 获取群组信息
      const marketplaceGroupInfo = await marketplaceContract.getGroupDetails(1);
      console.log('✅ Marketplace 群组 1 信息:', {
        name: marketplaceGroupInfo[0],
        description: marketplaceGroupInfo[1],
        maxSupply: marketplaceGroupInfo[2].toString(),
        currentSupply: marketplaceGroupInfo[3].toString(),
        isActive: marketplaceGroupInfo[4],
        price: marketplaceGroupInfo[5].toString(),
        payToken: marketplaceGroupInfo[6]
      });
      
    } catch (err) {
      console.log('⚠️ 群组信息获取失败:', err);
    }
    
    return {
      success: true,
      ipModelOwner,
      marketplaceOwner,
      recipient,
      linkedIPModel,
      isLinkedCorrectly: linkedIPModel.toLowerCase() === CONTRACT_ADDRESSES.IP_MODEL.toLowerCase()
    };
    
  } catch (error: any) {
    console.error('❌ 合约验证失败:', error);
    return {
      success: false,
      error: error?.message || '未知错误'
    };
  }
}

// 测试购买功能
export async function testPurchaseFunction(provider: ethers.BrowserProvider, userAddress: string, groupId: number = 1) {
  console.log('🛒 测试购买功能...');
  console.log('👤 用户地址:', userAddress);
  
  try {
    const signer = await provider.getSigner();
    const marketplaceContract = new ethers.Contract(
      CONTRACT_ADDRESSES.IP_MODEL_MARKETPLACE, 
      MARKETPLACE_ABI, 
      signer
    );
    
    // 获取群组信息
    const groupInfo = await marketplaceContract.getGroupDetails(groupId);
    console.log('📋 群组信息:', {
      name: groupInfo[0],
      price: groupInfo[5].toString(),
      payToken: groupInfo[6],
      isActive: groupInfo[4]
    });
    
    // 检查是否为免费 NFT
    if (groupInfo[5].toString() === '0') {
      console.log('🆓 这是免费 NFT，可以直接购买');
      
      // 模拟购买调用（不实际执行）
      console.log('📋 准备调用 buyTokens(', groupId, ', 1)');
      
      // 实际购买（取消注释以执行真实购买）
      // const tx = await marketplaceContract.buyTokens(groupId, 1);
      // console.log('📋 购买交易已发送:', tx.hash);
      // await tx.wait();
      // console.log('✅ 购买成功');
      
    } else {
      console.log('💰 这是付费 NFT，价格:', ethers.formatEther(groupInfo[5].toString()));
      console.log('💳 支付代币:', groupInfo[6]);
    }
    
  } catch (error) {
    console.error('❌ 购买测试失败:', error);
  }
}

// 在浏览器控制台中可用的函数
if (typeof window !== 'undefined') {
  window.verifyContract = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      return await verifyContractSetup(provider);
    } else {
      console.log('❌ 请先安装并连接 MetaMask');
    }
  };
  
  window.testPurchaseContract = async (groupId = 1) => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log('👤 用户地址:', userAddress);
      return await testPurchaseFunction(provider, userAddress, groupId);
    } else {
      console.log('❌ 请先安装并连接 MetaMask');
    }
  };
  
  console.log('📋 合约验证工具已加载');
  console.log('可用命令:');
  console.log('- verifyContract(): 验证合约配置');
  console.log('- testPurchaseContract(groupId): 测试购买功能');
}

// 扩展 Window 类型
declare global {
  interface Window {
    verifyContract?: () => Promise<any>;
    testPurchaseContract?: (groupId?: number) => Promise<any>;
  }
}
