import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-pink-500/20 transition-all duration-500 cursor-pointer hover:-translate-y-1 group"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-gray-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-pink-500/30 group-hover:to-gray-500/30 transition-all duration-300">
        <Icon className="w-6 h-6 text-pink-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      
      <div className="mt-4 flex items-center text-sm text-pink-600 group-hover:text-pink-500">
        <span className="font-medium">Explore</span>
        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default FeatureCard;