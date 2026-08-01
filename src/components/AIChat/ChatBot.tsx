import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiMinus } from 'react-icons/fi';
import CowAvatar from './CowAvatar';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import './ChatBot.css';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

/**
 * Enhanced ChatBot with Longcat AI Integration
 * - Uses Longcat AI API for real AI responses
 * - Secure API key from environment variables
 * - Cow mascot as assistant icon
 * - Premium glassmorphism design
 */

// Helper function to get API base URL
const getApiUrl = () => {
  // In development with Vite proxy, use relative path
  if (import.meta.env.DEV) {
    return '/api';
  }
  // In production, use the full API URL from environment variable
  return import.meta.env.VITE_API_URL || 'https://tasnim-dairy-farm-backend.onrender.com/api';
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'আস্সালামু আলাইকুম! 👋 আমি Tasnim AI, তাসনিম ডেইরি ফার্মের সহায়ক। আপনি কি জানতে চান?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Call Backend Chatbot API for AI response
   */
  const callChatbotAPI = async (userMessage: string): Promise<string> => {
    try {
      const apiUrl = getApiUrl();
      console.log('🔗 API URL:', apiUrl);
      console.log('📤 Sending message to API:', userMessage);
      
      const response = await fetch(`${apiUrl}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      console.log('📶 API Response Status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Chatbot API Error:', error);
        return 'আপনার প্রশ্নের উত্তর দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
      }

      const data = await response.json();
      console.log('✅ API Response Data:', data);
      return data.message || 'কোন প্রতিক্রিয়া পাওয়া যায়নি।';
    } catch (error) {
      console.error('🚨 Error calling Chatbot API:', error);
      return 'সার্ভারে সংযোগ বিচ্ছিন্ন হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
    }
  };

  const handleSendMessage = async (text: string) => {
    console.log('📨 handleSendMessage called with:', text);
    if (!text.trim()) {
      console.log('⚠️ Empty message, returning');
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    console.log('👤 Adding user message:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Get AI response from Backend Chatbot API
    console.log('🤖 Calling chatbot API...');
    const aiResponse = await callChatbotAPI(text);
    console.log('✅ Got response:', aiResponse);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: aiResponse,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="chatbot-trigger-wrapper"
        aria-label="Open Tasnim AI chat"
        title="Ask Tasnim AI"
      >
        <CowAvatar size="md" showOnlineIndicator={true} animate={true} />
      </button>
    );
  }

  return (
    <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
      <div className="chatbot-header">
        <div className="chatbot-header-content">
          <div className="chatbot-header-avatar">
            <CowAvatar size="sm" showOnlineIndicator={true} animate={false} />
          </div>
          <div className="chatbot-header-text">
            <h3>Tasnim AI</h3>
            <p className="online-status">Always Online</p>
          </div>
        </div>
        <div className="chatbot-header-actions">
          <button
            onClick={handleMinimize}
            className="chatbot-header-btn minimize-btn"
            aria-label="Minimize chat"
          >
            <FiMinus size={18} />
          </button>
          <button
            onClick={handleClose}
            className="chatbot-header-btn close-btn"
            aria-label="Close chat"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <ChatWindow messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </>
      )}
    </div>
  );
};

export default ChatBot;
