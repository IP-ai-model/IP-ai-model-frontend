# IP Model NFT 群组修复说明

## 修复内容

### 1. 群组索引修复
- **问题**: 原代码从索引0开始循环获取群组信息
- **修复**: 更改为从索引1开始，因为群组ID从1开始而不是0
- **影响文件**: 
  - `useIPModelNFTs.ts`
  - `useIPModelNFTsSimple.ts`

### 2. DreamLicense NFTs标签页增强
- **新增功能**: 在DreamLicense NFTs标签页也显示IP Model群组信息
- **组件**: 创建了`GroupInfoDisplay`组件用于展示群组信息
- **功能特性**:
  - 显示所有可用群组及其状态
  - 显示用户在每个群组中拥有的NFT数量
  - 群组详细信息展示
  - 供应量进度条
  - 价格和活跃状态标识

## 新增组件

### GroupInfoDisplay 组件
位置: `src/components/GroupInfoDisplay.tsx`

**主要功能:**
1. **群组概览卡片**
   - 群组名称和ID
   - 活跃状态标识
   - 供应量百分比和进度条
   - 价格信息（免费/付费）
   - 用户拥有NFT数量（可选显示）

2. **群组详细信息**
   - 点击群组卡片展开详细信息
   - 完整的群组元数据
   - 支付代币地址
   - 用户在该群组的NFT列表

3. **交互功能**
   - 点击选择/取消选择群组
   - 刷新按钮更新数据
   - 响应式设计适配移动端

**Props:**
- `className?: string` - 自定义样式类
- `showUserNFTs?: boolean` - 是否显示用户NFT信息

## 页面更新

### DreamLicense页面增强
1. **DreamLicense NFTs标签页**
   - 新增群组信息展示
   - 显示用户在各群组的NFT持有情况
   - 保留原有的NFT选择和ZK验证功能

2. **IP Model Collection标签页**
   - 保留合约测试组件
   - 群组信息展示
   - 完整的IP Model NFT展示

## 数据流程

### 群组数据获取
1. 连接到合约地址: `0xC27c894F4661A0FE5fF36341F298d33cd4876B44`
2. 调用 `getGroupCount()` 获取总群组数
3. 从索引1开始循环调用 `getGroupInfo(i)` 获取每个群组详情
4. 检查用户在每个群组的余额 `balanceOf(address, groupId)`

### 群组分类
- **活跃状态**: 根据 `isActive` 字段
- **价格类型**: 根据 `price` 字段（0为免费）
- **供应量状态**: 根据 `currentSupply/maxSupply` 比例

## 用户体验改进

### 视觉优化
1. **状态标识**
   - 绿色: 活跃群组
   - 灰色: 非活跃群组
   - 蓝色: 用户拥有NFT的群组

2. **进度指示**
   - 供应量进度条
   - 颜色编码: 绿色(低) → 黄色(中) → 红色(高)

3. **信息层次**
   - 卡片布局清晰展示关键信息
   - 详情面板提供完整信息
   - 响应式网格适配不同屏幕

### 交互优化
1. **加载状态**: 显示加载动画和提示
2. **错误处理**: 友好的错误信息和重试按钮
3. **实时更新**: 刷新按钮获取最新数据

## 技术实现

### 组件架构
```
DreamLicensePage
├── GroupInfoDisplay (新增)
│   ├── 群组卡片网格
│   ├── 群组详情面板
│   └── 加载/错误状态
├── NFTSelector (原有)
└── ZKVerification (原有)
```

### 数据共享
- 使用 `IPModelContext` 全局状态管理
- `GroupInfoDisplay` 组件可在多个标签页复用
- 自动同步群组和NFT数据

## 部署说明

所有更改已完成并通过编译检查：
- ✅ 群组索引修复 (从1开始)
- ✅ GroupInfoDisplay组件创建
- ✅ DreamLicense页面集成
- ✅ 类型定义更新
- ✅ 错误处理完善

开发服务器运行在: `http://localhost:5175`
