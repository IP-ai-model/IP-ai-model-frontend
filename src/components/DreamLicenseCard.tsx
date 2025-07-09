import React from 'react';
import { Users, Zap, ShoppingCart } from 'lucide-react';

interface DreamLicenseData {
  id: string;
  name: string;
  image: string;
  personality: string;
  interactions?: number;
  rating: number;
  price: string;
}

interface DreamLicenseCardProps {
  dreamLicense: DreamLicenseData;
  onImageClick?: (groupId: string) => void;
}

const DreamLicenseCard: React.FC<DreamLicenseCardProps> = ({ dreamLicense, onImageClick }) => {
  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onImageClick) {
      onImageClick(dreamLicense.id);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 hover:-translate-y-2 group">
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <img 
          src={dreamLicense.image} 
          alt={dreamLicense.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
          onClick={handleImageClick}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 悬停时显示购买按钮 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleImageClick}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transform scale-90 group-hover:scale-100 transition-transform duration-300"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>购买</span>
          </button>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{dreamLicense.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{dreamLicense.personality}</p>
      
      <div className="flex items-center justify-between mb-4">
        {dreamLicense.interactions && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{dreamLicense.interactions} interactions</span>
          </div>
        )}
        <div className="flex items-center space-x-1 text-sm text-pink-600 ml-auto">
          <Zap className="w-4 h-4" />
          <span className="font-medium">{dreamLicense.price}</span>
        </div>
      </div>
    </div>
  );
};

export default DreamLicenseCard;