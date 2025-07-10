import React, { useState, useEffect, useContext } from 'react';
import { useIPModel, IPModelContext } from '../contexts/IPModelContext';
import { IPModelGroup } from '../types/dreamlicense';
import { formatPrice as formatTokenPrice } from '../utils/tokenUtils';
import { useWallet } from '../hooks/useWallet';

interface IPModelDisplayProps {
  className?: string;
  onPageChange?: (page: string) => void;
}

const IPModelDisplay: React.FC<IPModelDisplayProps> = ({ className = '', onPageChange }) => {
  const { nfts, groups, groupedNFTs, loading, error, refetch } = useIPModel();
  const context = useContext(IPModelContext);
  if (!context) throw new Error('IPModelContext not found');
  const { setCurrentGroupName } = context;
  const { wallet } = useWallet();
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'inactive' | 'free' | 'paid'>('all');
  const [selectedGroup, setSelectedGroup] = useState<IPModelGroup | null>(null);
  const [formattedPrices, setFormattedPrices] = useState<Map<string, string>>(new Map());

  // 异步格式化群组价格
  useEffect(() => {
    const formatGroupPrices = async () => {
      if (!wallet.provider || groups.length === 0) return;

      const newFormattedPrices = new Map<string, string>();
      
      for (const group of groups) {
        try {
          const formattedPrice = await formatTokenPrice(
            group.price,
            group.payToken,
            wallet.provider
          );
          newFormattedPrices.set(group.groupId.toString(), formattedPrice);
        } catch (error) {
          console.error(`Failed to format price for group ${group.groupId}:`, error);
          newFormattedPrices.set(group.groupId.toString(), 
            group.price === '0' ? '免费' : `${group.price} tokens`
          );
        }
      }
      
      setFormattedPrices(newFormattedPrices);
    };

    formatGroupPrices();
  }, [groups, wallet.provider]);

  const getDisplayNFTs = () => {
    switch (selectedTab) {
      case 'active':
        return groupedNFTs.active;
      case 'inactive':
        return groupedNFTs.inactive;
      case 'free':
        return groupedNFTs.free;
      case 'paid':
        return groupedNFTs.paid;
      default:
        return nfts;
    }
  };

  const formatBalance = (balance: string) => {
    const num = parseInt(balance);
    return num > 0 ? num.toLocaleString() : '0';
  };

  const formatSupply = (current: string, max: string) => {
    const currentNum = parseInt(current);
    const maxNum = parseInt(max);
    const percentage = maxNum > 0 ? ((currentNum / maxNum) * 100).toFixed(1) : '0';
    return `${currentNum.toLocaleString()} / ${maxNum.toLocaleString()} (${percentage}%)`;
  };

  // 获取格式化的价格，优先使用异步格式化的结果
  const getFormattedPrice = (groupId: string, price: string): string => {
    const asyncPrice = formattedPrices.get(groupId);
    if (asyncPrice) {
      return asyncPrice;
    }
    // 回退到简单显示
    return price === '0' ? '免费' : `${price} tokens`;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        <span className="ml-3 text-gray-600">加载IP Model NFTs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center">
          <div className="text-red-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">加载错误</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={refetch}
          className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 标签页 */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all' as const, label: '全部', count: nfts.length },
          { key: 'active' as const, label: '活跃', count: groupedNFTs.active.length },
          { key: 'inactive' as const, label: '非活跃', count: groupedNFTs.inactive.length },
          { key: 'free' as const, label: '免费', count: groupedNFTs.free.length },
          { key: 'paid' as const, label: '付费', count: groupedNFTs.paid.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === tab.key
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* 群组信息 */}
      {groups.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">群组信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(group => (
              <div
                key={group.groupId}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedGroup?.groupId === group.groupId
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedGroup(selectedGroup?.groupId === group.groupId ? null : group)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{group.name || `群组 ${group.groupId}`}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    group.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {group.isActive ? '活跃' : '非活跃'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {group.description || '暂无描述'}
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>供应量: {formatSupply(group.currentSupply, group.maxSupply)}</div>
                  <div>价格: {getFormattedPrice(group.groupId.toString(), group.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NFT列表 */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">我的IP Model NFTs</h3>
          <button
            onClick={refetch}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded transition-colors"
          >
            刷新
          </button>
        </div>

        {getDisplayNFTs().length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500">
              {selectedTab === 'all' ? '您还没有任何IP Model NFTs' : `没有${selectedTab === 'active' ? '活跃' : selectedTab === 'inactive' ? '非活跃' : selectedTab === 'free' ? '免费' : '付费'}的NFTs`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getDisplayNFTs().map(nft => (
              <div
                key={`${nft.tokenId}-${nft.groupId}`} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow transform hover:scale-105 cursor-pointer"
                onClick={async () => {
                  onPageChange?.('ai-companion');
                  if (nft.groupInfo?.name) {
                    try {
                      setCurrentGroupName(nft.groupInfo.name);
                    } catch (error) {
                      console.error('Failed to send group name to backend:', error);
                    }
                  }
                }}
              >
                {/* NFT图片/占位符 */}
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <div key={`${nft.tokenId}-${nft.groupId}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    {/* NFT图片/占位符 */}
                    <div
                        className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                          <img
                              src={getImageName(nft.tokenId)}
                              className="w-full h-full object-cover rounded-lg"
                          />
                    </div>
                  </div>
                </div>

                {/* NFT信息 */}
                <div className="space-y-2">
                <h4 className="font-medium text-gray-900">
                    {nft.metadata?.name || `NFT #${nft.tokenId}`}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>群组: {nft.groupId}</span>
                    <span>余额: {formatBalance(nft.balance)}</span>
                  </div>
                  {nft.groupInfo && (
                    <div className="text-xs text-gray-500">
                      <div>群组: {nft.groupInfo.name || `群组 ${nft.groupInfo.groupId}`}</div>
                      <div className="flex items-center justify-between">
                        <span>{nft.groupInfo.isActive ? '✅ 活跃' : '❌ 非活跃'}</span>
                        <span>{nft.groupInfo.price === '0' ? '🆓 免费' : '💰 付费'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 选中群组的详细信息 */}
      {selectedGroup && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            群组详情: {selectedGroup.name || `群组 ${selectedGroup.groupId}`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">群组ID</label>
                <p className="text-gray-900">{selectedGroup.groupId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">名称</label>
                <p className="text-gray-900">{selectedGroup.name || '未设置'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">描述</label>
                <p className="text-gray-900">{selectedGroup.description || '暂无描述'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">状态</label>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  selectedGroup.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedGroup.isActive ? '活跃' : '非活跃'}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">供应量</label>
                <p className="text-gray-900">{formatSupply(selectedGroup.currentSupply, selectedGroup.maxSupply)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">价格</label>
                <p className="text-gray-900">
                  {getFormattedPrice(selectedGroup.groupId.toString(), selectedGroup.price)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">支付代币</label>
                <p className="text-gray-900 text-xs break-all">
                  {selectedGroup.payToken}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const getImageName = (tokenId: string): string => {
  switch (tokenId){
    case '1':
      return '../../public/。.jpg';
    case '2':
      return '../../public/k.jpg';
    case '3':
      return '屏幕截图 2025-07-02 171300.png';
    default:
      return '屏幕截图 2025-07-02 163516.png';
  }
};

export default IPModelDisplay;
