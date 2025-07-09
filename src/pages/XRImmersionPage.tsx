import React from 'react';
import { Headphones, Zap, Waves, Thermometer, Hand, Eye } from 'lucide-react';

const XRImmersionPage: React.FC = () => {
  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Headphones className="w-16 h-16 mx-auto mb-4 text-pink-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-gray-600 bg-clip-text text-transparent mb-4">
            XR Immersive Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionary sensory technology that brings your AI companion to life through haptic feedback and immersive environments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <Hand className="w-12 h-12 text-pink-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Haptic Feedback</h3>
            <p className="text-gray-600 mb-4">Advanced haptic suits and gloves provide realistic touch sensations</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Touch Sensitivity</span>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-5/6 h-full bg-gradient-to-r from-pink-500 to-pink-400"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Response Time</span>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-green-500 to-green-400"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <Thermometer className="w-12 h-12 text-pink-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Thermal Feedback</h3>
            <p className="text-gray-600 mb-4">Precise temperature control creates realistic warmth and coolness</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Temperature Range</span>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-gradient-to-r from-orange-500 to-orange-400"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Precision</span>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-5/6 h-full bg-gradient-to-r from-blue-500 to-blue-400"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <Eye className="w-12 h-12 text-pink-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Visual Immersion</h3>
            <p className="text-gray-600 mb-4">Ultra-high resolution VR environments with photorealistic rendering</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Resolution</span>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-purple-500 to-purple-400"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Frame Rate</span>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-5/6 h-full bg-gradient-to-r from-indigo-500 to-indigo-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Supported Hardware</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Haptic Devices</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-900/10 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">HaptX Gloves DK2</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-900/10 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Ultraleap Hand Tracking</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-900/10 rounded-lg">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Teslasuit Full Body</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">VR Headsets</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-900/10 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Meta Quest Pro</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-900/10 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Apple Vision Pro</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-900/10 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Varjo Aero</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <Waves className="w-12 h-12 text-pink-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Spatial Audio</h3>
            <p className="text-gray-600 mb-4">3D positional audio creates an immersive soundscape</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Binaural audio processing</li>
              <li>• Real-time spatial positioning</li>
              <li>• Adaptive frequency response</li>
              <li>• Noise cancellation</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <Zap className="w-12 h-12 text-pink-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Real-time Processing</h3>
            <p className="text-gray-600 mb-4">Ultra-low latency ensures seamless interaction</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Sub-20ms latency</li>
              <li>• Edge computing optimization</li>
              <li>• Predictive buffering</li>
              <li>• Adaptive quality scaling</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-gradient-to-r from-pink-500/20 to-gray-500/20 backdrop-blur-sm border border-white/30 rounded-xl py-4 px-8 text-lg font-medium text-gray-700 hover:from-pink-500/30 hover:to-gray-500/30 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-pink-500/20">
            Configure XR Experience
          </button>
        </div>
      </div>
    </div>
  );
};

export default XRImmersionPage;