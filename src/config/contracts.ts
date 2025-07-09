// 合约地址配置
export const CONTRACT_ADDRESSES = {
  // IP Model 合约地址
  IP_MODEL: '0xC27c894F4661A0FE5fF36341F298d33cd4876B44',
  
  // IP Model Marketplace 合约地址
  IP_MODEL_MARKETPLACE: '0x8fCf9a6F6a817D4383124982371E1A821E09addE',
  
  // 网络配置
  NETWORK: {
    chainId: 1, // 主网
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID'
  }
};

// 合约验证函数
export const validateContractAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// 检查是否为占位符地址
export const isPlaceholderAddress = (address: string): boolean => {
  const placeholderAddresses = [
    '0x0000000000000000000000000000000000000000',
    '0x1234567890123456789012345678901234567890',
    '0x0000000000000000000000000000000000000001',
    '0x1111111111111111111111111111111111111111',
  ];
  return placeholderAddresses.includes(address);
};
