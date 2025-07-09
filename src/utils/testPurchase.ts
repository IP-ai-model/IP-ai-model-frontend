// 购买功能测试用例
import { ethers } from 'ethers';

// 扩展 Window 接口
declare global {
  interface Window {
    ethereum?: any;
    testPurchase?: () => void;
    testContract?: () => void;
  }
}

// 模拟的测试数据
const testData = {
  groupId: '1',
  groupName: '测试群组',
  groupImage: '/test-image.jpg',
  price: '0', // 免费 NFT
  maxSupply: '100',
  currentSupply: '10',
  payToken: '0x0000000000000000000000000000000000000000',
  userAddress: '0x1234567890123456789012345678901234567890',
};

// 测试购买流程
export async function testPurchaseFlow() {
  console.log('🚀 开始测试购买流程...');
  
  // 1. 测试钱包连接
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      console.log('✅ 钱包连接成功:', address);
      
      // 2. 测试合约连接
      const contractAddress = '0xC27c894F4661A0FE5fF36341F298d33cd4876B44';
      const contract = new ethers.Contract(contractAddress, [
        'function getGroupInfo(uint256 groupId) view returns (string, string, uint256, uint256, bool, uint256, address)',
        'function balanceOf(address account, uint256 id) view returns (uint256)',
      ], provider);
      
      try {
        const groupInfo = await contract.getGroupInfo(testData.groupId);
        console.log('✅ 合约连接成功，群组信息:', groupInfo);
      } catch (error) {
        console.log('⚠️ 合约连接失败（可能是测试网络问题）:', error);
      }
      
    } catch (error) {
      console.log('❌ 钱包连接失败:', error);
    }
  } else {
    console.log('❌ 未检测到钱包');
  }
  
  // 3. 测试购买弹窗数据
  console.log('📝 测试购买弹窗数据:');
  console.log('群组ID:', testData.groupId);
  console.log('群组名称:', testData.groupName);
  console.log('价格:', testData.price === '0' ? '免费' : `${testData.price} tokens`);
  console.log('供应量:', `${testData.currentSupply}/${testData.maxSupply}`);
  console.log('可购买数量:', Math.min(parseInt(testData.maxSupply) - parseInt(testData.currentSupply), 10));
  
  // 4. 测试价格计算
  const quantity = 2;
  const totalPrice = parseInt(testData.price) * quantity;
  console.log('购买数量:', quantity);
  console.log('总价格:', totalPrice === 0 ? '免费' : `${totalPrice} tokens`);
  
  console.log('✅ 测试完成');
}

// 测试合约验证
export async function testContractValidation() {
  console.log('🔍 测试合约验证...');
  
  // 验证地址格式
  const testAddresses = [
    '0xC27c894F4661A0FE5fF36341F298d33cd4876B44', // 有效地址
    '0x1234567890123456789012345678901234567890', // 测试地址
    '0x0000000000000000000000000000000000000000', // 零地址
    'invalid-address' // 无效地址
  ];
  
  testAddresses.forEach(address => {
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
    const isPlaceholder = address === '0x0000000000000000000000000000000000000000' || 
                          address === '0x1234567890123456789012345678901234567890';
    
    console.log(`地址 ${address}:`, {
      valid: isValid,
      placeholder: isPlaceholder
    });
  });
  
  console.log('✅ 合约验证测试完成');
}

// 在浏览器控制台中运行测试
if (typeof window !== 'undefined') {
  window.testPurchase = testPurchaseFlow;
  window.testContract = testContractValidation;
  console.log('📋 可用的测试函数:');
  console.log('- testPurchase(): 测试购买流程');
  console.log('- testContract(): 测试合约验证');
}
