import React from 'react';
import { Star, Users, Zap } from 'lucide-react';

interface DreamLicenseData {
  id: string;
  name: string;
  image: string;
  personality: string;
  interactions: number;
  rating: number;
  price: string;
}

interface DreamLicenseCardProps {
  dreamLicense: DreamLicenseData;
}

const DreamLicenseCard: React.FC<DreamLicenseCardProps> = ({ dreamLicense }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 hover:-translate-y-2 group">
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <img 
          src={dreamLicense.image} 
          alt={dreamLicense.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{dreamLicense.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{dreamLicense.personality}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>{dreamLicense.interactions} interactions</span>
        </div>
        <div className="flex items-center space-x-1 text-sm text-pink-600">
          <Zap className="w-4 h-4" />
          <span className="font-medium">{dreamLicense.price}</span>
        </div>
      </div>
      
      <button className="w-full bg-gradient-to-r from-pink-500/20 to-gray-500/20 backdrop-blur-sm border border-white/30 rounded-xl py-3 px-4 text-sm font-medium text-gray-700 hover:from-pink-500/30 hover:to-gray-500/30 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-pink-500/20">
        Connect Dream
      </button>
    </div>
  );
};

export default DreamLicenseCard;