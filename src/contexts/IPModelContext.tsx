import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useIPModelNFTsSimple } from '../hooks/useIPModelNFTsSimple';
import { IPModelNFT, IPModelGroup, GroupedNFTs } from '../types/dreamlicense';

interface IPModelContextType {
  nfts: IPModelNFT[];
  groups: IPModelGroup[];
  groupedNFTs: GroupedNFTs;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getGroupInfo: (groupId: string) => Promise<IPModelGroup | null>;
  checkBalance: (groupId: string) => Promise<string>;
  currentGroupName: string | null;
  setCurrentGroupName: (name: string | null) => void;
}

export const IPModelContext = createContext<IPModelContextType | undefined>(undefined);

interface IPModelProviderProps {
  children: React.ReactNode;
  provider: ethers.BrowserProvider | null;
  address: string | null;
}

export const IPModelProvider: React.FC<IPModelProviderProps> = ({
  children,
  provider,
  address,
}) => {
  const {
    nfts,
    groups,
    loading,
    error,
    refetch,
    getNFTsByGroupType,
    getGroupInfo,
    checkBalance,
  } = useIPModelNFTsSimple(provider, address);

  const [groupedNFTs, setGroupedNFTs] = useState<GroupedNFTs>({
    active: [],
    inactive: [],
    highSupply: [],
    lowSupply: [],
    free: [],
    paid: [],
  });

  // 当NFT数据更新时，重新计算分组
  useEffect(() => {
    setGroupedNFTs(getNFTsByGroupType());
  }, [nfts, getNFTsByGroupType]);

  const [currentGroupName, setCurrentGroupName] = useState<string | null>(null);

  const value: IPModelContextType = {
    nfts,
    groups,
    groupedNFTs,
    loading,
    error,
    refetch,
    getGroupInfo,
    checkBalance,
    currentGroupName,
    setCurrentGroupName,
  };

  return (
    <IPModelContext.Provider value={value}>
      {children}
    </IPModelContext.Provider>
  );
};

export const useIPModel = (): IPModelContextType => {
  const context = useContext(IPModelContext);
  if (context === undefined) {
    throw new Error('useIPModel must be used within an IPModelProvider');
  }
  return context;
};
