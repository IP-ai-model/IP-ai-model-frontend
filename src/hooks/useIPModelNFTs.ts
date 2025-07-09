import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

// ERC1155 IP Model contract address
const IP_MODEL_CONTRACT_ADDRESS = '0xC27c894F4661A0FE5fF36341F298d33cd4876B44';

export interface IPModelGroup {
  groupId: string;
  name: string;
  description: string;
  maxSupply: string;
  currentSupply: string;
  isActive: boolean;
  price: string;
  payToken: string;
}

export interface IPModelNFT {
  tokenId: string;
  groupId: string;
  balance: string;
  uri: string;
  metadata?: any;
  groupInfo?: IPModelGroup;
}

export const useIPModelNFTs = (provider: ethers.BrowserProvider | null, address: string | null) => {
  const [nfts, setNfts] = useState<IPModelNFT[]>([]);
  const [groups, setGroups] = useState<IPModelGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContract = useCallback(async () => {
    if (!provider) {
      console.log('No provider available');
      return null;
    }
    try {
      console.log('Creating contract with address:', IP_MODEL_CONTRACT_ADDRESS);
      
      // 动态导入 ABI
      const IPModelABI = await import('../../abi/IPModel.json');
      console.log('ABI loaded:', !!IPModelABI.default);
      
      return new ethers.Contract(IP_MODEL_CONTRACT_ADDRESS, IPModelABI.default, provider);
    } catch (err) {
      console.error('Failed to create contract:', err);
      return null;
    }
  }, [provider]);

  // 获取所有群组信息
  const fetchGroups = async () => {
    const contract = await getContract();
    if (!contract) {
      console.log('No contract available for fetchGroups');
      return [];
    }

    try {
      console.log('Fetching group count...');
      const groupCount = await contract.getGroupCount();
      const groupCountNumber = Number(groupCount);
      console.log('Total groups found:', groupCountNumber);
      
      if (groupCountNumber === 0) {
        console.log('No groups found in contract');
        return [];
      }

      const groupPromises = [];
      // 群组从1开始，不是0
      for (let i = 1; i <= groupCountNumber; i++) {
        groupPromises.push(
          (async () => {
            try {
              console.log(`Fetching group ${i}...`);
              const groupInfo = await contract.getGroupInfo(i);
              console.log(`Group ${i} info:`, groupInfo);
              return {
                groupId: i.toString(),
                name: groupInfo[0],
                description: groupInfo[1],
                maxSupply: groupInfo[2].toString(),
                currentSupply: groupInfo[3].toString(),
                isActive: groupInfo[4],
                price: groupInfo[5].toString(),
                payToken: groupInfo[6],
              };
            } catch (err) {
              console.error(`Failed to fetch group ${i}:`, err);
              return null;
            }
          })()
        );
      }

      const results = await Promise.all(groupPromises);
      const validGroups = results.filter((group): group is IPModelGroup => group !== null);
      console.log('Valid groups fetched:', validGroups);
      return validGroups;
    } catch (err) {
      console.error('Failed to fetch groups:', err);
      return [];
    }
  };

  // 获取用户在指定群组的NFT余额
  const fetchUserNFTsInGroup = async (groupId: string) => {
    const contract = await getContract();
    if (!contract || !address) return [];

    try {
      // 对于ERC1155，tokenId通常与groupId相同
      const balance = await contract.balanceOf(address, groupId);
      
      if (balance > 0) {
        const uri = await contract.uri(groupId);
        
        return [{
          tokenId: groupId,
          groupId: groupId,
          balance: balance.toString(),
          uri: uri,
        }];
      }
      
      return [];
    } catch (err) {
      console.error(`Failed to fetch NFTs for group ${groupId}:`, err);
      return [];
    }
  };

  // 获取用户所有NFT
  const fetchUserNFTs = async () => {
    if (!provider || !address) {
      console.log('No provider or address available:', { provider: !!provider, address });
      return;
    }

    try {
      console.log('Starting fetchUserNFTs for address:', address);
      setLoading(true);
      setError(null);

      // 先获取所有群组
      const allGroups = await fetchGroups();
      console.log('All groups fetched:', allGroups.length);
      setGroups(allGroups);

      if (allGroups.length === 0) {
        console.log('No groups found, setting empty NFTs array');
        setNfts([]);
        return;
      }

      // 为每个群组检查用户是否拥有NFT
      const nftPromises = allGroups.map(group => 
        fetchUserNFTsInGroup(group.groupId)
      );

      const nftResults = await Promise.all(nftPromises);
      const userNFTs = nftResults.flat();
      console.log('User NFTs found:', userNFTs.length);

      // 为每个NFT添加群组信息和元数据
      const enrichedNFTs = await Promise.all(
        userNFTs.map(async (nft) => {
          const groupInfo = allGroups.find(g => g.groupId === nft.groupId);
          
          // 尝试获取元数据
          let metadata = null;
          try {
            if (nft.uri && nft.uri !== '' && !nft.uri.includes('undefined')) {
              console.log(`Fetching metadata from URI: ${nft.uri}`);
              const response = await fetch(nft.uri);
              if (response.ok) {
                metadata = await response.json();
                console.log(`Metadata fetched for NFT ${nft.tokenId}:`, metadata);
              }
            }
          } catch (err) {
            console.warn(`Failed to fetch metadata for NFT ${nft.tokenId}:`, err);
          }

          return {
            ...nft,
            groupInfo,
            metadata,
          };
        })
      );

      console.log('Enriched NFTs:', enrichedNFTs);
      setNfts(enrichedNFTs);

    } catch (err: any) {
      console.error('Failed to fetch IP Model NFTs:', err);
      setError(err.message || 'Failed to fetch IP Model NFTs');
    } finally {
      setLoading(false);
    }
  };

  // 根据群组类型筛选NFT
  const getNFTsByGroupType = useCallback((nfts: IPModelNFT[]) => {
    const groupedNFTs = {
      active: [] as IPModelNFT[],
      inactive: [] as IPModelNFT[],
      highSupply: [] as IPModelNFT[],
      lowSupply: [] as IPModelNFT[],
      free: [] as IPModelNFT[],
      paid: [] as IPModelNFT[],
    };

    nfts.forEach(nft => {
      if (nft.groupInfo) {
        // 按活跃状态分类
        if (nft.groupInfo.isActive) {
          groupedNFTs.active.push(nft);
        } else {
          groupedNFTs.inactive.push(nft);
        }

        // 按供应量分类
        const supplyRatio = Number(nft.groupInfo.currentSupply) / Number(nft.groupInfo.maxSupply);
        if (supplyRatio > 0.8) {
          groupedNFTs.highSupply.push(nft);
        } else {
          groupedNFTs.lowSupply.push(nft);
        }

        // 按价格分类
        if (nft.groupInfo.price === '0') {
          groupedNFTs.free.push(nft);
        } else {
          groupedNFTs.paid.push(nft);
        }
      }
    });

    return groupedNFTs;
  }, []);

  // 获取指定群组的详细信息
  const getGroupInfo = useCallback(async (groupId: string): Promise<IPModelGroup | null> => {
    const contract = await getContract();
    if (!contract) return null;

    try {
      const groupInfo = await contract.getGroupInfo(groupId);
      return {
        groupId,
        name: groupInfo[0],
        description: groupInfo[1],
        maxSupply: groupInfo[2].toString(),
        currentSupply: groupInfo[3].toString(),
        isActive: groupInfo[4],
        price: groupInfo[5].toString(),
        payToken: groupInfo[6],
      };
    } catch (err) {
      console.error(`Failed to fetch group info for ${groupId}:`, err);
      return null;
    }
  }, [getContract]);

  // 检查用户在指定群组的余额
  const checkBalance = useCallback(async (groupId: string): Promise<string> => {
    const contract = await getContract();
    if (!contract || !address) return '0';

    try {
      const balance = await contract.balanceOf(address, groupId);
      return balance.toString();
    } catch (err) {
      console.error(`Failed to check balance for group ${groupId}:`, err);
      return '0';
    }
  }, [getContract, address]);

  useEffect(() => {
    fetchUserNFTs();
  }, [provider, address]);

  return {
    nfts,
    groups,
    loading,
    error,
    refetch: fetchUserNFTs,
    getNFTsByGroupType: () => getNFTsByGroupType(nfts),
    getGroupInfo,
    checkBalance,
  };
};
