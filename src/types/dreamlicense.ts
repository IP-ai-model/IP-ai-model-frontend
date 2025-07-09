export interface NFTMetadata {
  id: string;
  name: string;
  description: string;
  image: string;
  personality: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface DreamLicenseNFT {
  tokenId: string;
  metadata: NFTMetadata;
  tokenURI: string;
}

export interface ZKProof {
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
  };
  publicSignals: string[];
}

export interface VerificationData {
  walletAddress: string;
  nftId: string;
  zkProof: ZKProof;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  verified: boolean;
}

// IP Model ERC1155 NFT types
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
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
    attributes?: Array<{
      trait_type: string;
      value: string;
    }>;
  };
  groupInfo?: IPModelGroup;
}

export interface GroupedNFTs {
  active: IPModelNFT[];
  inactive: IPModelNFT[];
  highSupply: IPModelNFT[];
  lowSupply: IPModelNFT[];
  free: IPModelNFT[];
  paid: IPModelNFT[];
}