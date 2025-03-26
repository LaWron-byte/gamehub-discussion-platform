
import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';

type ChatMessage = {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  timestamp: Date;
};

type SavedMessage = {
  id: string;
  content: string;
  timestamp: Date;
};

export const ChatWindow = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'saved'>('general');
  const [message, setMessage] = useState('');
  
  // Demo data - in a real app, this would come from a database or API
  const [generalMessages] = useState<ChatMessage[]>([]);
  const [savedMessages] = useState<SavedMessage[]>([]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isLoggedIn) return;
    
    // In a real app, this would send the message to a backend
    console.log('Sending message:', message);
    
    // Clear the input
    setMessage('');
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="fixed top-20 right-4 z-50 w-80 md:w-96 h-[80vh] bg-card border border-border rounded-lg shadow-elevated flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">{t('chat')}</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-secondary transition-colors"
          aria-label={t('closeChat')}
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 p-3 text-sm font-medium transition-colors ${
            activeTab === 'general' 
              ? 'border-b-2 border-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('general')}
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 p-3 text-sm font-medium transition-colors ${
            activeTab === 'saved' 
              ? 'border-b-2 border-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('saved')}
        </button>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'general' ? (
          generalMessages.length > 0 ? (
            generalMessages.map((msg) => (
              <div key={msg.id} className="flex space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden flex-shrink-0">
                  {msg.avatar ? (
                    <img src={msg.avatar} alt={msg.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-semibold">
                      {msg.username[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-sm">{msg.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{msg.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-center">
                {t('noChatMessages')}
              </p>
            </div>
          )
        ) : (
          savedMessages.length > 0 ? (
            savedMessages.map((msg) => (
              <div key={msg.id} className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-sm">{msg.content}</p>
                <div className="flex justify-end mt-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-center">
                {t('noSavedMessages')}
              </p>
            </div>
          )
        )}
      </div>
      
      {/* Input Area */}
      {activeTab === 'general' && isLoggedIn && (
        <form onSubmit={handleSubmit} className="border-t border-border p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('sendMessage')}
              className="flex-1 p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};
