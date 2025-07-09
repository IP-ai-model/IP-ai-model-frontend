# Melodyn - Web3 Fantasy Intimacy Protocol

A decentralized platform for AI companions and immersive experiences powered by Web3 technology.

## Features

- **MetaMask Wallet Integration**: Secure authentication using Web3 wallets
- **DreamLicense NFTs**: Exclusive AI companion access through NFT ownership
- **Zero-Knowledge Privacy**: Complete privacy protection using zk-SNARKs
- **AI Companion Generation**: Personalized AI companions with deep emotional intelligence
- **XR Immersive Experiences**: Haptic feedback and virtual reality integration

## Setup Instructions

### Prerequisites

1. **MetaMask Wallet**: Install [MetaMask](https://metamask.io) browser extension
2. **Node.js**: Version 16 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd melodyn

# Install dependencies
npm install

# Start development server
npm run dev
```

### Wallet Configuration

1. **Install MetaMask**: Download and install the MetaMask browser extension
2. **Create/Import Wallet**: Set up your Ethereum wallet
3. **Connect to Network**: Ensure you're connected to the correct Ethereum network
4. **Get Test ETH**: For development, use a testnet and get test ETH from a faucet

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `VITE_API_BASE_URL`: Backend API URL (optional for demo)
- `NODE_ENV`: Environment (development/production)

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Authentication Flow

1. **Wallet Connection**: Users connect their MetaMask wallet
2. **Address Verification**: Wallet address is used as unique identifier
3. **NFT Access**: DreamLicense NFTs provide access to exclusive AI companions
4. **Zero-Knowledge Proofs**: Privacy-preserving verification for interactions

### Smart Contract Integration

The application integrates with:
- **DreamLicense NFT Contract**: For AI companion access
- **Zero-Knowledge Verification**: For private interactions
- **Ethereum Mainnet/Testnets**: For production and development

### Features Overview

#### 🔐 Web3 Authentication
- MetaMask wallet integration
- Secure wallet-based login
- No traditional passwords required

#### 🎨 DreamLicense NFTs
- Unique AI companion personalities
- Blockchain-verified ownership
- Transferable and tradeable

#### 🛡️ Zero-Knowledge Privacy
- Complete interaction privacy
- No data collection
- Cryptographic proof verification

#### 🤖 AI Companions
- Personalized personalities
- Emotional intelligence
- Memory and learning capabilities

#### 🥽 XR Experiences
- Virtual reality integration
- Haptic feedback support
- Immersive environments

### Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Web3**: ethers.js + MetaMask
- **Privacy**: zk-SNARKs (snarkjs)
- **Icons**: Lucide React

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### License

This project is licensed under the MIT License.