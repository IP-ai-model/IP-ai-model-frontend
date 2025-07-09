# DreamLicense NFT 购买功能使用指南

## 概述

本项目实现了完整的 DreamLicense NFT 购买功能，支持通过 IPModelMarketplace 合约进行购买。

## 功能特性

### 1. 购买弹窗功能
- ✅ 点击 NFT 卡片图片弹出购买弹窗
- ✅ 显示供应量、价格、用户余额等信息
- ✅ 支持购买数量选择（1-10个）
- ✅ 实时检查购买上限和库存
- ✅ 支持两种购买方式：Marketplace 和直接铸造

### 2. 合约购买支持
- ✅ IPModelMarketplace 合约集成
- ✅ 代币支付支持（需要先授权）
- ✅ 免费 NFT 购买
- ✅ 钱包连接和交易签名
- ✅ 交易状态反馈

### 3. 权限管理
- ✅ 授权铸造者检查
- ✅ 合约所有者权限验证
- ✅ 购买权限提示

## 使用说明

### 1. 基本购买流程

1. **连接钱包**：确保 MetaMask 或其他支持的钱包已连接
2. **浏览 NFT**：在首页查看可用的 DreamLicense NFT
3. **点击购买**：点击 NFT 卡片的图片打开购买弹窗
4. **选择数量**：根据需要选择购买数量（最多10个）
5. **确认购买**：点击"立即购买"按钮
6. **签名交易**：在钱包中确认交易

### 2. 购买方式

#### 方式一：Marketplace 购买（推荐）
- 通过 IPModelMarketplace 合约购买
- 支持代币支付（需要先授权）
- 支持免费 NFT 购买
- 无需特殊权限

#### 方式二：直接铸造
- 直接调用 IPModel 合约的 mint 方法
- 需要铸造者授权或合约所有者权限
- 仅支持免费 NFT

### 3. 支付方式

- **免费 NFT**：无需支付，直接购买
- **代币支付**：需要先授权 Marketplace 合约使用代币
- **ETH 支付**：暂不支持（合约限制）

## 技术实现

### 1. 合约地址配置

在 `src/config/contracts.ts` 中配置合约地址：

```typescript
export const CONTRACT_ADDRESSES = {
  IP_MODEL: '0xC27c894F4661A0FE5fF36341F298d33cd4876B44',
  IP_MODEL_MARKETPLACE: '0x1234567890123456789012345678901234567890', // 需要替换
};
```

### 2. 核心组件

- **PurchaseNFTModal.tsx**：购买弹窗组件
- **HomePage.tsx**：首页展示和弹窗集成
- **useIPModelNFTsSimple.ts**：数据加载 Hook

### 3. 合约 ABI

支持的合约方法：
- `buyTokens(uint256 groupId, uint256 amount)`
- `getGroupDetails(uint256 groupId)`
- `mint(address to, uint256 groupId, uint256 amount)`

## 部署 Marketplace 合约

### 1. 准备工作

1. 确保有足够的 ETH 用于部署
2. 准备收款地址
3. 配置 RPC 节点

### 2. 部署脚本

使用 `src/utils/deployMarketplace.ts` 中的部署脚本：

```typescript
const config = {
  ipModelAddress: '0xC27c894F4661A0FE5fF36341F298d33cd4876B44',
  recipientAddress: '0xYourRecipientAddress',
  rpcUrl: 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
  privateKey: 'YOUR-PRIVATE-KEY'
};

const result = await deployMarketplace(config);
```

### 3. 更新配置

部署成功后，更新 `src/config/contracts.ts` 中的 `IP_MODEL_MARKETPLACE` 地址。

## 测试指南

### 1. 本地测试

```bash
npm run dev
```

### 2. 测试流程

1. 连接测试网钱包
2. 确保有足够的测试代币
3. 尝试购买免费 NFT
4. 测试代币支付功能

### 3. 调试信息

查看浏览器控制台获取详细的调试信息，包括：
- 合约调用日志
- 交易哈希
- 错误信息

## 常见问题

### 1. 购买失败

- **钱包余额不足**：检查 ETH 余额（用于 gas 费）
- **代币余额不足**：检查付费代币余额
- **未授权**：需要先授权 Marketplace 合约使用代币
- **供应量已满**：NFT 已售罄

### 2. 合约错误

- **合约地址错误**：检查配置文件中的合约地址
- **网络不匹配**：确保钱包连接到正确的网络
- **ABI 不匹配**：确保 ABI 与合约版本匹配

### 3. 权限问题

- **无铸造权限**：使用 Marketplace 购买而非直接铸造
- **合约暂停**：联系合约管理员

## 开发注意事项

1. **合约地址**：确保使用正确的合约地址
2. **网络配置**：确保前端连接到正确的区块链网络
3. **Gas 费用**：考虑交易的 gas 费用设置
4. **错误处理**：完善用户友好的错误提示
5. **交易确认**：等待交易确认后再更新 UI

## 更新日志

- **v1.0.0**：基础购买功能实现
- **v1.1.0**：Marketplace 合约集成
- **v1.2.0**：代币支付支持
- **v1.3.0**：权限管理优化

## 支持与反馈

如有问题或建议，请：
1. 检查控制台错误信息
2. 查看交易详情
3. 联系开发团队
