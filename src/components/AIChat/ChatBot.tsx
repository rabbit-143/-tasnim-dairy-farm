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

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'আস্সালামু আলাইকুম! 👋 আমি তাসনিম ডেইরি ফার্মের AI সহায়ক। আপনি কি জানতে চান?',
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

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `আপনার প্রশ্ন: "${text}" এর উত্তর দিতে আমি এখানে আছি। আমাদের দলের সাথে যোগাযোগ করতে আমরা আপনাকে সাহায্য করতে পারি।`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
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
        aria-label="Open chat"
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
