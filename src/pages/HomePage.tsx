import React from 'react';
import DreamLicenseCard from '../components/DreamLicenseCard';
import FeatureCard from '../components/FeatureCard';
import { Sparkles, Heart, Shield, Headphones } from 'lucide-react';

interface HomePageProps {
  onPageChange: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const dreamLicenses = [
    {
      id: '1',
      name: 'Moon Harim',
      image: '/。.jpg',
      personality: 'Kpop star/Actress | Whispers born in stardust',
      interactions: 1247,
      rating: 4.9,
      price: '2.5 ETH'
    },
    {
      id: '2',
      name: 'Jarvis',
      image: '/k.jpg',
      personality: 'MLB superstar | Precision with a heartbeat',
      interactions: 892,
      rating: 4.8,
      price: '1.8 ETH'
    },
    {
      id: '3',
      name: 'Rin',
      image: '/屏幕截图 2025-07-02 171300.png',
      personality: 'Virtual singer | Digital soul, infinite feeling',
      interactions: 634,
      rating: 4.7,
      price: '3.2 ETH'
    },
    {
      id: '4',
      name: 'Suzuki Haruka',
      image: '/屏幕截图 2025-07-02 163516.png',
      personality: 'TV actress | A smile soft as morning rain',
      interactions: 945,
      rating: 4.8,
      price: '2.1 ETH'
    }
  ];

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

      {/* New DreamLicense NFTs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">New DreamLicense NFTs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover exclusive virtual companions ready to create personalized dream experiences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dreamLicenses.map((dreamLicense) => (
            <DreamLicenseCard key={dreamLicense.id} dreamLicense={dreamLicense} />
          ))}
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
    </div>
  );
};

export default HomePage;