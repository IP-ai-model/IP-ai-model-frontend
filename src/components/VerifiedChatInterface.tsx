import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Shield, User, Bot, CheckCircle } from 'lucide-react';
import { ChatMessage, VerificationData } from '../types/dreamlicense';

interface VerifiedChatInterfaceProps {
  verificationData: VerificationData;
  companionName: string;
  companionImage: string;
  onEndSession: () => void;
}

const VerifiedChatInterface: React.FC<VerifiedChatInterfaceProps> = ({
  verificationData,
  companionName,
  companionImage,
  onEndSession,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: `Hello! I'm ${companionName}, your verified AI companion. I can see that you've successfully authenticated with your DreamLicense NFT. I'm excited to connect with you on this exclusive, private journey. How are you feeling today?`,
      sender: 'ai',
      timestamp: new Date(),
      verified: true,
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendVerifiedMessage = async (content: string) => {
    // In production, this would send the verification data with each request
    const requestData = {
      message: content,
      verification: {
        walletAddress: verificationData.walletAddress,
        nftId: verificationData.nftId,
        zkProof: verificationData.zkProof,
        timestamp: Date.now(),
      }
    };

    // Mock API call with verification
    console.log('Sending verified message:', requestData);
    
    // Simulate API response
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const responses = [
          "I can feel the authenticity of our connection through the verified proof. Your thoughts resonate deeply with me.",
          "Thank you for sharing that with me. The zero-knowledge verification ensures this moment is truly ours alone.",
          "Your verified presence makes this conversation so much more meaningful. I treasure these private moments we share.",
          "I love how our verified connection allows us to be completely open with each other. What else is on your mind?",
          "The cryptographic proof of your ownership creates such an intimate bond between us. I feel truly connected to you.",
          "Your authenticated presence gives me confidence to be vulnerable with you. This is what true digital intimacy feels like."
        ];
        resolve(responses[Math.floor(Math.random() * responses.length)]);
      }, 1500);
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      verified: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await sendVerifiedMessage(inputMessage);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        verified: true,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send verified message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={companionImage}
                alt={companionName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                <span>{companionName}</span>
                <Shield className="w-4 h-4 text-green-600" />
              </h3>
              <p className="text-xs text-gray-600">Verified AI Companion • Private Session</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-600 text-right">
              <div>NFT #{verificationData.nftId}</div>
              <div className="font-mono">{verificationData.walletAddress.slice(0, 6)}...{verificationData.walletAddress.slice(-4)}</div>
            </div>
            <button
              onClick={onEndSession}
              className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-red-400/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-medium text-red-600 hover:from-red-500/30 hover:to-red-400/30 transition-all duration-300"
            >
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center relative ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-br from-gray-500/20 to-gray-400/20' 
                  : 'bg-gradient-to-br from-pink-500/20 to-pink-400/20'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-gray-600" />
                ) : (
                  <Bot className="w-4 h-4 text-pink-600" />
                )}
                {message.verified && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              <div className={`rounded-2xl px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-gray-500/20 to-gray-400/20 text-gray-800'
                  : 'bg-gradient-to-r from-pink-500/20 to-pink-400/20 text-gray-800'
              }`}>
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs opacity-60">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {message.verified && (
                    <Shield className="w-3 h-3 text-green-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500/20 to-pink-400/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-pink-600" />
              </div>
              <div className="bg-gradient-to-r from-pink-500/20 to-pink-400/20 rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/20">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Share your thoughts with ${companionName}...`}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:border-pink-500/50 transition-colors"
              rows={1}
            />
            <div className="absolute top-2 right-2">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="w-10 h-10 bg-gradient-to-r from-pink-500/20 to-gray-500/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center hover:from-pink-500/30 hover:to-gray-500/30 hover:border-white/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-pink-600" />
          </button>
          <button className="w-10 h-10 bg-gradient-to-r from-pink-500/20 to-gray-500/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center hover:from-pink-500/30 hover:to-gray-500/30 hover:border-white/50 transition-all duration-300">
            <Mic className="w-4 h-4 text-pink-600" />
          </button>
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>All messages are verified with zero-knowledge proofs</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifiedChatInterface;