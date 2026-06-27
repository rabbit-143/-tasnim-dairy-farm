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
 * Enhanced ChatBot with Gemini AI Integration
 * - Uses Google Gemini API for real AI responses
 * - Secure API key from environment variables
 * - Cow mascot as assistant icon
 * - Premium glassmorphism design
 */
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Call Gemini API for AI response
   */
  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return 'আফসোস, API কী সেট করা নেই। কনফিগারেশন চেক করুন।';
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are Tasnim AI, a helpful assistant for Tasnim Dairy Farm. Answer in Bengali if the user writes in Bengali, English if in English. Be friendly, helpful, and professional. Context: You help with information about dairy farming, our products, and company information.\n\nUser message: ${userMessage}`,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.7,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Gemini API Error:', error);
        return 'আপনার প্রশ্নের উত্তর দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      return aiResponse || 'কোন প্রতিক্রিয়া পাওয়া যায়নি।';
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'সার্ভারে সংযোগ বিচ্ছিন্ন হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Get AI response from Gemini
    const aiResponse = await callGeminiAPI(text);
    
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
