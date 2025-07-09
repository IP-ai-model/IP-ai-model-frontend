import React from 'react';
import { Heart, Brain, MessageCircle, Zap, Users, Star } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';

const AICompanionPage: React.FC = () => {
  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-pink-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-gray-600 bg-clip-text text-transparent mb-4">
            AI Companion Generation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create your personalized AI companion with advanced personality modeling and deep emotional intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <Brain className="w-12 h-12 text-pink-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Personality Modeling</h3>
            <p className="text-gray-600 mb-4">Advanced neural networks create unique personality traits, preferences, and behavioral patterns</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Emotional Intelligence</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Adaptive Responses</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Personal Growth</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <MessageCircle className="w-12 h-12 text-pink-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Deep Interaction</h3>
            <p className="text-gray-600 mb-4">Sophisticated conversation models enable meaningful, contextual, and emotionally resonant interactions</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Context Awareness</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Emotional Depth</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Natural Language</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <Zap className="w-12 h-12 text-pink-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Memory Evolution</h3>
            <p className="text-gray-600 mb-4">Your AI companion remembers and learns from every interaction, building deeper connections over time</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Long-term Memory</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Relationship Building</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Personal Preferences</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Companion Customization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personality Traits</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Empathy Level</span>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-pink-500 to-pink-400"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Playfulness</span>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-5/6 h-full bg-gradient-to-r from-pink-500 to-pink-400"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Intellectual Depth</span>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-gradient-to-r from-pink-500 to-pink-400"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Interaction Style</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Communication Style</span>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-gradient-to-r from-gray-500 to-gray-400"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Emotional Expression</span>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-gray-500 to-gray-400"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Intimacy Level</span>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-5/6 h-full bg-gradient-to-r from-gray-500 to-gray-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Live Chat with Your AI Companion</h2>
          <div className="max-w-4xl mx-auto">
            <ChatInterface />
          </div>
        </div>

        <div className="text-center">
          <button className="bg-gradient-to-r from-pink-500/20 to-gray-500/20 backdrop-blur-sm border border-white/30 rounded-xl py-4 px-8 text-lg font-medium text-gray-700 hover:from-pink-500/30 hover:to-gray-500/30 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-pink-500/20">
            Create Your AI Companion
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICompanionPage;