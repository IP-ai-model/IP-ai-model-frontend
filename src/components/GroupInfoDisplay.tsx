import React, { useState } from 'react';
import { useIPModel } from '../contexts/IPModelContext';
import { IPModelGroup } from '../types/dreamlicense';

interface GroupInfoDisplayProps {
  className?: string;
  showUserNFTs?: boolean;
}

const GroupInfoDisplay: React.FC<GroupInfoDisplayProps> = ({ 
  className = '', 
  showUserNFTs = false 
}) => {
  const { groups, nfts, loading, error, refetch } = useIPModel();
  const [selectedGroup, setSelectedGroup] = useState<IPModelGroup | null>(null);

  const formatSupply = (current: string, max: string) => {
    const currentNum = parseInt(current);
    const maxNum = parseInt(max);
    const percentage = maxNum > 0 ? ((currentNum / maxNum) * 100).toFixed(1) : '0';
    return `${currentNum.toLocaleString()} / ${maxNum.toLocaleString()} (${percentage}%)`;
  };

  const getUserNFTsInGroup = (groupId: string) => {
    return nfts.filter(nft => nft.groupId === groupId);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        <span className="ml-3 text-gray-600">加载群组信息...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
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

  if (groups.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-gray-500">暂无可用群组</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 群组概览 */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">IP Model 群组</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>总群组: {groups.length}</span>
            <span>活跃: {groups.filter(g => g.isActive).length}</span>
            <span>免费: {groups.filter(g => g.price === '0').length}</span>
            <button
              onClick={refetch}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors"
            >
              刷新
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(group => {
            const userNFTsInGroup = showUserNFTs ? getUserNFTsInGroup(group.groupId) : [];
            
            return (
              <div
                key={group.groupId}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedGroup?.groupId === group.groupId
                    ? 'border-pink-500 bg-pink-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => setSelectedGroup(selectedGroup?.groupId === group.groupId ? null : group)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 truncate">
                    {group.name || `群组 ${group.groupId}`}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      group.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {group.isActive ? '活跃' : '非活跃'}
                    </span>
                    {showUserNFTs && userNFTsInGroup.length > 0 && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        拥有 {userNFTsInGroup.length}
                      </span>
                    )}
                  </div>
                </div>

                {group.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {group.description}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">供应量:</span>
                    <span className="font-medium">{formatSupply(group.currentSupply, group.maxSupply)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">价格:</span>
                    <span className={`font-medium ${group.price === '0' ? 'text-green-600' : 'text-gray-700'}`}>
                      {group.price === '0' ? '免费' : `${group.price} tokens`}
                    </span>
                  </div>
                  {showUserNFTs && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">我的NFT:</span>
                      <span className="font-medium text-blue-600">
                        {userNFTsInGroup.reduce((sum, nft) => sum + parseInt(nft.balance), 0)} 个
                      </span>
                    </div>
                  )}
                </div>

                {/* 供应量进度条 */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        (Number(group.currentSupply) / Number(group.maxSupply)) > 0.8 
                          ? 'bg-red-500' 
                          : (Number(group.currentSupply) / Number(group.maxSupply)) > 0.6 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ 
                        width: `${Math.min((Number(group.currentSupply) / Number(group.maxSupply)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 选中群组的详细信息 */}
      {selectedGroup && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            群组详情: {selectedGroup.name || `群组 ${selectedGroup.groupId}`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">群组ID</label>
                <p className="text-gray-900 mt-1">{selectedGroup.groupId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">名称</label>
                <p className="text-gray-900 mt-1">{selectedGroup.name || '未设置'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">状态</label>
                <div className="mt-1">
                  <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                    selectedGroup.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedGroup.isActive ? '✅ 活跃' : '❌ 非活跃'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">供应量详情</label>
                <div className="mt-1 space-y-1">
                  <p className="text-gray-900">当前: {Number(selectedGroup.currentSupply).toLocaleString()}</p>
                  <p className="text-gray-900">最大: {Number(selectedGroup.maxSupply).toLocaleString()}</p>
                  <p className="text-gray-500 text-sm">
                    进度: {((Number(selectedGroup.currentSupply) / Number(selectedGroup.maxSupply)) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">价格</label>
                <p className="text-gray-900 mt-1">
                  {selectedGroup.price === '0' ? '🆓 免费' : `💰 ${selectedGroup.price} tokens`}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">支付代币地址</label>
                <p className="text-gray-900 text-xs break-all mt-1 font-mono bg-gray-50 p-2 rounded">
                  {selectedGroup.payToken}
                </p>
              </div>
              {showUserNFTs && (
                <div>
                  <label className="text-sm font-medium text-gray-700">我在此群组的NFT</label>
                  <div className="mt-1">
                    {getUserNFTsInGroup(selectedGroup.groupId).map(nft => (
                      <div key={nft.tokenId} className="flex justify-between items-center p-2 bg-blue-50 rounded mb-1">
                        <span className="text-sm">Token #{nft.tokenId}</span>
                        <span className="text-sm font-medium text-blue-600">余额: {nft.balance}</span>
                      </div>
                    ))}
                    {getUserNFTsInGroup(selectedGroup.groupId).length === 0 && (
                      <p className="text-gray-500 text-sm">暂无NFT</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupInfoDisplay;
