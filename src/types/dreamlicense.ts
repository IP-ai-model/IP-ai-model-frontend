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