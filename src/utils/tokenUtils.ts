import { ethers } from 'ethers';

// TestToken合约ABI - 只包含我们需要的函数
const TEST_TOKEN_ABI = [
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
];

export interface TokenInfo {
  decimals: number;
  symbol: string;
  name: string;
}

// 缓存token信息
const tokenInfoCache = new Map<string, TokenInfo>();

export const getTokenInfo = async (
  tokenAddress: string,
  provider: ethers.BrowserProvider
): Promise<TokenInfo | null> => {
  // 检查缓存
  if (tokenInfoCache.has(tokenAddress.toLowerCase())) {
    return tokenInfoCache.get(tokenAddress.toLowerCase())!;
  }

  try {
    const contract = new ethers.Contract(tokenAddress, TEST_TOKEN_ABI, provider);
    
    const [decimals, symbol, name] = await Promise.all([
      contract.decimals(),
      contract.symbol(),
      contract.name(),
    ]);

    const tokenInfo: TokenInfo = {
      decimals: Number(decimals),
      symbol,
      name,
    };

    // 缓存结果
    tokenInfoCache.set(tokenAddress.toLowerCase(), tokenInfo);
    
    return tokenInfo;
  } catch (err) {
    console.error(`Failed to get token info for ${tokenAddress}:`, err);
    return null;
  }
};

export const formatTokenAmount = (
  amount: string,
  decimals: number,
  symbol?: string
): string => {
  try {
    const formattedAmount = ethers.formatUnits(amount, decimals);
    const numericAmount = parseFloat(formattedAmount);
    
    // 格式化显示
    let displayAmount: string;
    if (numericAmount === 0) {
      displayAmount = '0';
    } else if (numericAmount < 0.0001) {
      displayAmount = '< 0.0001';
    } else if (numericAmount < 1) {
      displayAmount = numericAmount.toFixed(4);
    } else if (numericAmount < 1000) {
      displayAmount = numericAmount.toFixed(2);
    } else {
      displayAmount = numericAmount.toLocaleString();
    }
    
    return symbol ? `${displayAmount} ${symbol}` : displayAmount;
  } catch (err) {
    console.error('Failed to format token amount:', err);
    return `${amount} tokens`;
  }
};

export const formatPrice = async (
  priceWei: string,
  tokenAddress: string,
  provider: ethers.BrowserProvider | null
): Promise<string> => {
  if (priceWei === '0') {
    return '免费';
  }
  
  if (!provider) {
    return `${priceWei} tokens`;
  }

  // 零地址表示ETH
  if (tokenAddress === '0x0000000000000000000000000000000000000000') {
    const ethAmount = ethers.formatEther(priceWei);
    const numericAmount = parseFloat(ethAmount);
    if (numericAmount < 0.0001) {
      return '< 0.0001 ETH';
    }
    return `${numericAmount.toFixed(4)} ETH`;
  }

  // 获取token信息
  const tokenInfo = await getTokenInfo(tokenAddress, provider);
  if (tokenInfo) {
    return formatTokenAmount(priceWei, tokenInfo.decimals, tokenInfo.symbol);
  }

  return `${priceWei} tokens`;
};
