import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { DreamLicenseNFT, NFTMetadata } from '../types/dreamlicense';

// Mock contract ABI for DreamLicense NFT
const DREAMLICENSE_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
];

// Mock contract address (replace with actual deployed contract)
const DREAMLICENSE_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';

export const useDreamLicenseNFTs = (provider: ethers.BrowserProvider | null, address: string | null) => {
  const [nfts, setNfts] = useState<DreamLicenseNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async () => {
    if (!provider || !address) return;

    try {
      setLoading(true);
      setError(null);

      const contract = new ethers.Contract(
        DREAMLICENSE_CONTRACT_ADDRESS,
        DREAMLICENSE_ABI,
        provider
      );

      // Get balance of NFTs owned by the user
      const balance = await contract.balanceOf(address);
      const balanceNumber = Number(balance);

      if (balanceNumber === 0) {
        setNfts([]);
        return;
      }

      const nftPromises = [];
      
      // Fetch each NFT owned by the user
      for (let i = 0; i < balanceNumber; i++) {
        nftPromises.push(
          (async () => {
            try {
              const tokenId = await contract.tokenOfOwnerByIndex(address, i);
              const tokenURI = await contract.tokenURI(tokenId);
              
              // Fetch metadata from IPFS or HTTP endpoint
              const metadataResponse = await fetch(tokenURI);
              const metadata: NFTMetadata = await metadataResponse.json();
              
              return {
                tokenId: tokenId.toString(),
                metadata,
                tokenURI,
              };
            } catch (err) {
              console.error(`Failed to fetch NFT at index ${i}:`, err);
              return null;
            }
          })()
        );
      }

      const results = await Promise.all(nftPromises);
      const validNFTs = results.filter((nft): nft is DreamLicenseNFT => nft !== null);
      
      setNfts(validNFTs);

    } catch (err: any) {
      // Handle specific ethers decoding errors for mock contract
      if (err.code === 'BAD_DATA' && err.info?.method === 'balanceOf') {
        console.warn('DreamLicense contract not deployed on current network - using demo NFTs:', err.message);
        setError('DreamLicense contract not deployed on current network. Showing demo NFTs.');
      } else {
        console.error('Failed to fetch NFTs:', err);
        setError(err.message || 'Failed to fetch NFTs');
      }
      
      // For demo purposes, set mock NFTs if contract call fails
      setNfts([
        {
          tokenId: '1',
          tokenURI: 'https://example.com/metadata/1',
          metadata: {
            id: '1',
            name: 'Aurora Dream',
            description: 'A gentle and empathetic AI companion who loves poetry and stargazing.',
            image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
            personality: 'Gentle, empathetic, loves poetry and stargazing',
            attributes: [
              { trait_type: 'Personality', value: 'Empathetic' },
              { trait_type: 'Interests', value: 'Poetry' },
              { trait_type: 'Rarity', value: 'Legendary' }
            ]
          }
        },
        {
          tokenId: '2',
          tokenURI: 'https://example.com/metadata/2',
          metadata: {
            id: '2',
            name: 'Luna Mystery',
            description: 'A mysterious and artistic AI companion who loves deep conversations.',
            image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
            personality: 'Mysterious, artistic, loves deep conversations',
            attributes: [
              { trait_type: 'Personality', value: 'Mysterious' },
              { trait_type: 'Interests', value: 'Art' },
              { trait_type: 'Rarity', value: 'Epic' }
            ]
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [provider, address]);

  return {
    nfts,
    loading,
    error,
    refetch: fetchNFTs,
  };
};