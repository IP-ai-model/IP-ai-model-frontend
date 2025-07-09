// 部署 IPModelMarketplace 合约的脚本
import { ethers } from 'ethers';

// 合约字节码 - 这需要从合约编译结果中获取
const MARKETPLACE_BYTECODE = "0x608060405234801561001057600080fd5b50604051610123380380610123833981016040819052610031916100a4565b600080546001600160a01b03199081163317909155600180546001600160a01b03868116919093161790925560028054921691909117905550506100d7565b80516001600160a01b038116811461009f57600080fd5b919050565b600080604083850312156100b757600080fd5b6100c083610088565b91506100ce60208401610088565b90509250929050565b61003d806100e66000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063075461721461003b578063c9b08c2c14610061575b600080fd5b6001546100499061010090046001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f35b6100496100093660046001600160a01b031681565b056fea2646970667358221220f6d5e4c3a8c5a1b4e9b5d7f8a2e6b5c1e9a8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b8c9b0a6c7b5c6c7b"; // 这是一个占位符，实际需要从合约编译结果中获取

interface DeploymentConfig {
  ipModelAddress: string;
  recipientAddress: string;
  rpcUrl: string;
  privateKey: string;
}

export async function deployMarketplace(config: DeploymentConfig) {
  try {
    // 连接到提供商
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const wallet = new ethers.Wallet(config.privateKey, provider);
    
    console.log('部署者地址:', wallet.address);
    console.log('部署者余额:', ethers.formatEther(await provider.getBalance(wallet.address)), 'ETH');
    
    // 创建合约工厂
    const MarketplaceFactory = new ethers.ContractFactory(
      [
        "constructor(address _ipModelContract, address _recipient)"
      ],
      MARKETPLACE_BYTECODE,
      wallet
    );
    
    // 部署合约
    console.log('正在部署 IPModelMarketplace 合约...');
    const marketplace = await MarketplaceFactory.deploy(
      config.ipModelAddress,
      config.recipientAddress
    );
    
    console.log('等待部署确认...');
    await marketplace.waitForDeployment();
    
    const marketplaceAddress = await marketplace.getAddress();
    
    console.log('✅ IPModelMarketplace 合约部署成功!');
    console.log('合约地址:', marketplaceAddress);
    console.log('交易哈希:', marketplace.deploymentTransaction()?.hash);
    
    return {
      address: marketplaceAddress,
      transactionHash: marketplace.deploymentTransaction()?.hash
    };
    
  } catch (error) {
    console.error('❌ 部署失败:', error);
    throw error;
  }
}

// 使用示例
export async function deployExample() {
  const config: DeploymentConfig = {
    ipModelAddress: '0xC27c894F4661A0FE5fF36341F298d33cd4876B44',
    recipientAddress: '0xYourRecipientAddress', // 替换为实际的收款地址
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID', // 替换为实际的RPC URL
    privateKey: 'YOUR-PRIVATE-KEY' // 替换为实际的私钥
  };
  
  const result = await deployMarketplace(config);
  console.log('部署结果:', result);
  
  // 更新配置文件
  console.log('请将以下地址更新到 src/config/contracts.ts 中:');
  console.log(`IP_MODEL_MARKETPLACE: '${result.address}',`);
}

// 验证合约
export async function verifyMarketplace(address: string, rpcUrl: string) {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const marketplace = new ethers.Contract(address, [
      "function ipModelContract() view returns (address)",
      "function recipient() view returns (address)",
      "function owner() view returns (address)"
    ], provider);
    
    const ipModelContract = await marketplace.ipModelContract();
    const recipient = await marketplace.recipient();
    const owner = await marketplace.owner();
    
    console.log('✅ 合约验证成功:');
    console.log('IP Model 合约地址:', ipModelContract);
    console.log('收款地址:', recipient);
    console.log('所有者地址:', owner);
    
    return {
      ipModelContract,
      recipient,
      owner
    };
    
  } catch (error) {
    console.error('❌ 验证失败:', error);
    throw error;
  }
}
