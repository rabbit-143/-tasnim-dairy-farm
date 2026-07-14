import React from 'react';
import { BsRobot } from 'react-icons/bs';
import './ChatWindow.css';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, messagesEndRef }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message-row message-${message.type}`}>
            {message.type === 'bot' && (
              <div className="message-avatar">
                <BsRobot size={16} />
              </div>
            )}
            <div className={`message ${message.type}`}>
              <p>{message.content}</p>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message-row message-bot">
            <div className="message-avatar">
              <BsRobot size={16} />
            </div>
            <div className="message bot loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
