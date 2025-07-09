# IP Model ERC1155 NFT 集成说明

## 概述

本项目已成功集成了ERC1155格式的IP Model NFT合约，合约地址为 `0xC27c894F4661A0FE5fF36341F298d33cd4876B44`。通过ABI文件夹中的`IPModel.json`文件，应用可以与智能合约进行交互，查询和显示不同群组的NFT。

## 核心修复 (简化版本)

### ✅ 完成的关键修复
1. **群组ID修正**: 群组ID现在从1开始，而不是0
   - 修改了`useIPModelNFTsSimple.ts`中的循环：`for (let i = 1; i <= groupCountNumber; i++)`

2. **DreamLicense标签页增强**: 
   - 在DreamLicense NFTs标签页中添加了群组信息概览提示
   - 为后续的群组类型显示预留了空间

3. **代码简化**:
   - 移除了复杂的价格格式化逻辑
   - 删除了不必要的组件 (ContractTest, GroupInfoCard, tokenUtils等)
   - 保持核心功能的同时简化了代码结构

### 🎯 核心功能

#### 1. 全局NFT管理
- **`useIPModelNFTsSimple` Hook**: 管理ERC1155 NFT的获取和状态
- **`IPModelProvider` Context**: 全局提供IP Model NFT数据  
- **自动分组**: 根据群组类型自动分类NFT（活跃/非活跃、免费/付费、高/低供应量）

#### 2. 群组信息查询 (修复后)
通过合约ABI提供的函数进行查询：
- `getGroupCount()`: 获取总群组数量
- `getGroupInfo(groupId)`: 获取指定群组的详细信息 (从ID=1开始)
- `balanceOf(address, tokenId)`: 查询用户在特定群组的余额
- `uri(tokenId)`: 获取NFT的元数据URI

#### 3. 用户界面
- **标签页导航**: DreamLicense NFTs 和 IP Model Collection
- **群组信息概览**: DreamLicense标签页显示群组提示信息
- **完整群组展示**: IP Model Collection标签页显示详细群组信息和NFT

### 📁 文件结构
```
src/
├── hooks/
│   └── useIPModelNFTsSimple.ts    # 简化的ERC1155 NFT数据管理Hook
├── contexts/
│   └── IPModelContext.tsx         # 全局NFT状态管理
├── components/
│   └── IPModelDisplay.tsx         # 简化的NFT展示组件
├── types/
│   └── dreamlicense.ts           # IP Model相关类型定义
└── pages/
    └── DreamLicensePage.tsx      # 集成了双标签页显示
```

### 🚀 下一步可以添加的功能
1. **TestToken decimals处理**: 重新添加复杂的价格格式化
2. **群组详细信息**: 在DreamLicense标签页添加更多群组统计
3. **NFT交易功能**: 集成市场功能
4. **性能优化**: 数据缓存和懒加载

## 使用方法

1. **连接钱包**: 用户需要首先连接MetaMask钱包
2. **查看DreamLicense NFTs**: 在DreamLicense标签页查看传统NFT和群组概览
3. **查看IP Model Collection**: 切换到IP Model标签页查看详细的群组信息和ERC1155 NFT
4. **群组管理**: 实时显示供应量、价格信息和活跃状态

## 配置信息

- **合约地址**: `0xC27c894F4661A0FE5fF36341F298d33cd4876B44`
- **ABI文件**: `abi/IPModel.json`  
- **标准**: ERC1155
- **群组ID**: 从1开始 (已修复)
- **网络**: 根据用户钱包配置自动检测

## 主要功能

### 1. 全局NFT管理
- **`useIPModelNFTs` Hook**: 管理ERC1155 NFT的获取和状态
- **`IPModelProvider` Context**: 全局提供IP Model NFT数据
- **自动分组**: 根据群组类型自动分类NFT（活跃/非活跃、免费/付费、高/低供应量）

### 2. 群组信息查询
通过合约ABI提供的函数进行查询：
- `getGroupCount()`: 获取总群组数量
- `getGroupInfo(groupId)`: 获取指定群组的详细信息
- `balanceOf(address, tokenId)`: 查询用户在特定群组的余额
- `uri(tokenId)`: 获取NFT的元数据URI

### 3. 群组类型区别

#### 根据活跃状态分类：
- **活跃群组**: `isActive = true` 的群组
- **非活跃群组**: `isActive = false` 的群组

#### 根据价格分类：
- **免费群组**: `price = 0` 的群组
- **付费群组**: `price > 0` 的群组

#### 根据供应量分类：
- **高供应量群组**: 当前供应量占最大供应量80%以上
- **低供应量群组**: 当前供应量占最大供应量80%以下

### 4. 用户界面
- **标签页导航**: 在DreamLicense页面添加了"IP Model Collection"标签
- **群组信息展示**: 显示所有可用群组及其详细信息
- **NFT展示**: 显示用户拥有的IP Model NFT
- **实时数据**: 支持刷新和实时更新

## 技术实现

### 文件结构
```
src/
├── hooks/
│   └── useIPModelNFTs.ts          # ERC1155 NFT数据管理Hook
├── contexts/
│   └── IPModelContext.tsx         # 全局NFT状态管理
├── components/
│   └── IPModelDisplay.tsx         # NFT展示组件
├── types/
│   └── dreamlicense.ts           # 添加了IP Model相关类型定义
└── pages/
    └── DreamLicensePage.tsx      # 集成了IP Model展示
```

### 主要组件

#### `useIPModelNFTs` Hook
- 连接ERC1155合约
- 获取用户NFT余额
- 查询群组信息
- 获取NFT元数据

#### `IPModelProvider` Context
- 全局状态管理
- 自动分组功能
- 跨组件数据共享

#### `IPModelDisplay` Component
- 响应式UI设计
- 标签页筛选
- 群组详情展示
- NFT卡片展示

### 智能合约交互

#### 关键函数调用：
```typescript
// 获取群组总数
const groupCount = await contract.getGroupCount();

// 获取群组信息
const groupInfo = await contract.getGroupInfo(groupId);
// 返回: [name, description, maxSupply, currentSupply, isActive, price, payToken]

// 查询用户余额
const balance = await contract.balanceOf(userAddress, tokenId);

// 获取NFT元数据URI
const uri = await contract.uri(tokenId);
```

## 使用方法

### 1. 连接钱包
用户需要首先连接MetaMask钱包

### 2. 切换到IP Model标签
在DreamLicense页面点击"IP Model Collection"标签

### 3. 查看NFT
- 系统自动加载用户拥有的所有IP Model NFT
- 显示群组信息和NFT详情
- 支持按类型筛选

### 4. 群组管理
- 点击群组卡片查看详细信息
- 实时显示供应量和价格信息
- 区分活跃和非活跃状态

## 扩展功能

### 未来可以添加的功能：
1. **NFT交易**: 集成市场功能
2. **群组创建**: 允许用户创建新群组
3. **批量操作**: 支持批量转移NFT
4. **价格监控**: 实时监控群组价格变化
5. **通知系统**: 群组状态变化通知

## 开发注意事项

1. **网络配置**: 确保连接到正确的区块链网络
2. **错误处理**: 完善的错误处理和用户提示
3. **性能优化**: 合理的数据缓存和更新策略
4. **用户体验**: 加载状态和错误状态的友好展示

## 配置信息

- **合约地址**: `0xC27c894F4661A0FE5fF36341F298d33cd4876B44`
- **ABI文件**: `abi/IPModel.json`
- **标准**: ERC1155
- **网络**: 根据用户钱包配置自动检测
