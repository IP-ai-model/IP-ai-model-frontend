import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Heart, Sparkles, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Aurora, your AI companion. I'm here to listen, understand, and connect with you on a deeper level. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
      emotion: 'warm'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchAIResponse = async (userInput: string): Promise<string> => {
    try {
      const response = await fetch(`/query?query=${encodeURIComponent(userInput)}`);
      const data = await response.json();

      if (data.success) {
        return data.response || "抱歉，没有收到有效回复。";
      } else {
        console.error('API error:', data.error);
        return "抱歉，AI 暂时无法回答这个问题。";
      }
    } catch (error) {
      console.error('请求失败:', error);
      return "连接服务器失败，请稍后再试。";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {

    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 调用真实后端接口获取 AI 回复
    const aiReply = await fetchAIResponse(inputMessage);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: aiReply,
      sender: 'ai',
      timestamp: new Date(),
      emotion: 'caring'
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl h-96 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500/30 to-gray-500/30 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Aurora</h3>
            <p className="text-xs text-gray-600">Your AI Companion • Online</p>
          </div>
          <div className="ml-auto">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-br from-gray-500/20 to-gray-400/20' 
                  : 'bg-gradient-to-br from-pink-500/20 to-pink-400/20'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-gray-600" />
                ) : (
                  <Bot className="w-4 h-4 text-pink-600" />
                )}
              </div>
              <div className={`rounded-2xl px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-gray-500/20 to-gray-400/20 text-gray-800'
                  : 'bg-gradient-to-r from-pink-500/20 to-pink-400/20 text-gray-800'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
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
              placeholder="Share your thoughts with Aurora..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:border-pink-500/50 transition-colors"
              rows={1}
            />
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
      </div>
    </div>
  );
};

export default ChatInterface;