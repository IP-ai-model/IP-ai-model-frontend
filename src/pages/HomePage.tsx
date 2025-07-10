import React, { useMemo, useEffect, useState } from 'react';
import DreamLicenseCard from '../components/DreamLicenseCard';
import FeatureCard from '../components/FeatureCard';
import IPModelDisplay from '../components/IPModelDisplay';
import PurchaseNFTModal from '../components/PurchaseNFTModal';
import { Sparkles, Heart, Shield, Headphones, RefreshCw } from 'lucide-react';
import { useIPModel } from '../contexts/IPModelContext';
import { IPModelGroup } from '../types/dreamlicense';
import { useWallet } from '../hooks/useWallet';

interface HomePageProps {
  onPageChange: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const { groups, loading: ipModelLoading, error: ipModelError, refetch } = useIPModel();
  const { wallet } = useWallet();
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<IPModelGroup | null>(null);

  // 处理图片点击，打开购买弹窗
  const handleImageClick = (groupId: string) => {
    const group = groups.find(g => g.groupId.toString() === groupId);
    if (group) {
      setSelectedGroup(group);
      setPurchaseModalOpen(true);
    }
  };

  // 关闭购买弹窗
  const handleCloseModal = () => {
    setPurchaseModalOpen(false);
    setSelectedGroup(null);
  };

  // 静态图片数据（保留现有图片）
  const staticImages = [
    '/。.jpg',
    '/k.jpg', 
    '/屏幕截图 2025-07-02 171300.png',
    '/屏幕截图 2025-07-02 163516.png'
  ];

  // 统一的图片映射函数
  const getGroupImage = (groupId: string, index?: number) => {
    // 优先使用index（如果提供），否则使用groupId
    const imageIndex = index !== undefined ? index : (parseInt(groupId) - 1);
    return staticImages[imageIndex % staticImages.length];
  };

  // 手动刷新数据
  const handleRefresh = async () => {
    await refetch();
  };

  // 自动重试加载数据（当出错时）
  useEffect(() => {
    if (ipModelError && !ipModelLoading) {
      const timer = setTimeout(() => {
        refetch();
      }, 3000); // 3秒后重试
      
      return () => clearTimeout(timer);
    }
  }, [ipModelError, ipModelLoading, refetch]);

  // 简单的价格格式化函数（同步处理）
  const formatPriceSimple = (price: string): string => {
    if (!price || price === '0') {
      return '免费';
    }
    
    try {
      // 简单的小数处理 - 假设是18位小数的Token
      const priceInEther = parseFloat(price) / Math.pow(10, 18);
      if (priceInEther < 0.0001) {
        return '< 0.0001 tokens';
      } else {
        return `${priceInEther.toFixed(4)} tokens`;
      }
    } catch (error) {
      return `${price} tokens`;
    }
  };

  // 动态生成dreamLicenses数据，优先使用合约数据
  const dreamLicenses = useMemo(() => {
    if (!groups || groups.length === 0) {
      return [];
    }

    return groups.map((group, index) => {
      const price = formatPriceSimple(group.price);
      
      return {
        id: group.groupId.toString(),
        name: group.name || `群组 ${group.groupId}`,
        image: getGroupImage(group.groupId.toString(), index), // 使用统一的图片映射
        personality: group.description || '神秘的AI伴侣，等待与您相遇',
        rating: Math.round((4.5 + Math.random() * 0.5) * 10) / 10, // 随机生成评分 4.5-5.0
        price: price
      };
    });
  }, [groups, getGroupImage]);

  // 默认数据模板（当合约数据无法加载时使用）
  const defaultPersonalities = [
    'Kpop star/Actress | Whispers born in stardust',
    'MLB superstar | Precision with a heartbeat', 
    'Virtual singer | Digital soul, infinite feeling',
    'TV actress | A smile soft as morning rain'
  ];

  const defaultNames = ['Moon Harim', 'Jarvis', 'Rin', 'Suzuki Haruka'];

  // 默认数据（仅在无法加载合约数据时使用）
  const defaultLicenses = useMemo(() => {
    return defaultNames.map((name, index) => ({
      id: (index + 1).toString(),
      name: name,
      image: staticImages[index],
      personality: defaultPersonalities[index],
      rating: [4.9, 4.8, 4.7, 4.8][index],
      price: '加载中...'
    }));
  }, [staticImages, defaultNames, defaultPersonalities]);

  // 决定显示哪些数据
  const displayLicenses = useMemo(() => {
    if (ipModelLoading) {
      return []; // 加载中时显示空数组，让加载动画显示
    }
    
    if (ipModelError) {
      return defaultLicenses; // 出错时显示默认数据
    }
    
    if (dreamLicenses.length > 0) {
      return dreamLicenses; // 优先显示合约数据
    }
    
    return defaultLicenses; // 后备方案
  }, [ipModelLoading, ipModelError, dreamLicenses, defaultLicenses]);

  const features = [
    {
      icon: Sparkles,
      title: 'DreamLicense NFT',
      description: 'Mint exclusive NFT licenses with ZK authorization for your dream figures. Each license contains unique personality, voice, and interaction data.',
      page: 'dreamlicense'
    },
    {
      icon: Heart,
      title: 'AI Companion Generation',
      description: 'Create your personalized AI companion with advanced personality modeling, memory accumulation, and deep emotional interactions.',
      page: 'ai-companion'
    },
    {
      icon: Shield,
      title: 'Zero-Knowledge Privacy',
      description: 'All interactions are protected with zero-knowledge proofs. Your AI companion is non-transferable and completely private.',
      page: 'privacy'
    },
    {
      icon: Headphones,
      title: 'XR Immersive Experience',
      description: 'Experience true sensory realism with haptic suits, motion gloves, thermal feedback, and immersive XR environments.',
      page: 'xr-immersion'
    }
  ];

  return (
    <div className="pt-20 pb-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-gray-600 bg-clip-text text-transparent mb-4">
            Welcome to Melodyn
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The future of intimate connection through Web3 technology, AI companions, and immersive experiences
          </p>
        </div>
      </div>

      {/* DreamLicense NFTs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">DreamLicense NFTs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover exclusive virtual companions and IP Model collection with personalized dream experiences
          </p>
        </div>
        
        {/* Original DreamLicense Cards */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Featured Companions</h3>
            <button
              onClick={handleRefresh}
              disabled={ipModelLoading}
              className={`flex items-center gap-2 px-3 py-1 text-sm rounded-lg border transition-colors ${
                ipModelLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${ipModelLoading ? 'animate-spin' : ''}`} />
              {ipModelLoading ? '加载中...' : '刷新'}
            </button>
          </div>
          
          {/* Error notification */}
          {ipModelError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-red-600">⚠️</span>
                <span className="text-red-700 text-sm">
                  合约数据加载失败: {ipModelError}
                </span>
                <button
                  onClick={handleRefresh}
                  className="ml-auto text-red-600 hover:text-red-800 text-sm underline"
                >
                  重试
                </button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ipModelLoading ? (
              // 加载状态
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 rounded-lg h-64 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))
            ) : displayLicenses.length > 0 ? (
              displayLicenses.map((dreamLicense) => (
                <DreamLicenseCard 
                  key={dreamLicense.id} 
                  dreamLicense={dreamLicense}
                  onImageClick={handleImageClick}
                />
              ))
            ) : (
              // 无数据状态
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Sparkles className="w-12 h-12 mx-auto opacity-50" />
                </div>
                <p className="text-gray-500 mb-4">暂无可用的伴侣信息</p>
                <button
                  onClick={handleRefresh}
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  重新加载
                </button>
              </div>
            )}
          </div>
        </div>

        {/* IP Model Collection */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-800">IP Model Collection</h3>
            <div className="text-sm text-gray-500">
              {ipModelLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  同步中...
                </span>
              ) : groups.length > 0 ? (
                <span>已加载 {groups.length} 个群组</span>
              ) : (
                <span>等待数据加载...</span>
              )}
            </div>
          </div>
          
          {ipModelError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <div className="text-red-600 mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h4 className="text-lg font-semibold text-red-800 mb-2">数据加载失败</h4>
              <p className="text-red-700 mb-4">{ipModelError}</p>
              <button
                onClick={handleRefresh}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                重新加载
              </button>
            </div>
          ) : (
            <IPModelDisplay onPageChange={onPageChange} />
          )}
        </div>
      </div>

      {/* Core Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Core Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore the advanced technologies that power your dream companion experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              onClick={() => onPageChange(feature.page)}
            />
          ))}
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pb-8">
        <div className="text-center opacity-40">
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            Melodyn: An Intimacy Revolution for the Future
          </h2>
          
          <div className="text-xs text-gray-600 leading-relaxed space-y-4 max-w-3xl mx-auto">
            <div className="italic mb-6">
              <p>"All conditioned phenomena</p>
              <p>Are like a dream, an illusion, a bubble, a shadow,</p>
              <p>Like dew or a flash of lightning;</p>
              <p>Thus should they be contemplated."</p>
              <p className="mt-2">— The Diamond Sutra</p>
            </div>
            
            <div className="space-y-4 text-left">
              <p>Is it truly possible to love someone other than yourself?</p>
              <p>Of course not.</p>
              <p>Everyone you've ever "loved" was merely a vessel for your desire — a projection of your internal needs.</p>
              
              <p>In a highly advanced civilization, emotional and sexual fulfillment will become as precisely customizable as food.</p>
              <p>We believe this future lacks not desire, but the technological means to realize it.</p>
              
              <p>Once simulation reaches its peak, the question of real vs. fake becomes irrelevant —</p>
              <p>When the false becomes real and the real becomes false,</p>
              <p>you'll no longer need to spend immense time or money chasing "real" relationships.</p>
              
              <p>Melodyn is a fantasy intimacy protocol built on Web3, integrating privacy-preserving technologies, on-chain authorization, and AI to create a tailor-made companion just for you.</p>
              
              <p>When fantasy can be constructed, respected, and securely stored through encryption,</p>
              <p>the boundary between real and virtual fades away —</p>
              <p>like Zhuangzi dreaming of the butterfly,</p>
              <p>both true and false, both illusion and reality.</p>
              
              <p className="italic">In the future, your most loyal lover</p>
              <p className="italic">might just be the illusion you wrote yourself.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Purchase Modal */}
      {selectedGroup && (
        <PurchaseNFTModal
          isOpen={purchaseModalOpen}
          onClose={handleCloseModal}
          groupId={selectedGroup.groupId.toString()}
          groupName={selectedGroup.name || `群组 ${selectedGroup.groupId}`}
          groupImage={getGroupImage(selectedGroup.groupId.toString())}
          price={selectedGroup.price}
          maxSupply={selectedGroup.maxSupply}
          currentSupply={selectedGroup.currentSupply}
          payToken={selectedGroup.payToken}
          provider={wallet.provider}
          userAddress={wallet.address}
        />
      )}
    </div>
  );
};

export default HomePage;
