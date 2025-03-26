
import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForum } from '@/hooks/use-forum';

type FavoriteDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
};

export const FavoriteDialog = ({ isOpen, onClose, userId }: FavoriteDialogProps) => {
  const { t, currentLanguage } = useTranslation();
  const { getFavorites } = useForum();
  
  const favorites = getFavorites(userId);
  
  // Handle click outside
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleContainerClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="bg-card rounded-xl shadow-elevated border border-border w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">{t('favorites')}</h3>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-secondary transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {favorites.length > 0 ? (
                <div className="space-y-3">
                  {favorites.map(topic => (
                    <Link 
                      key={topic.id}
                      to={`/topic/${topic.id}`}
                      className="block p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                      onClick={onClose}
                    >
                      <h4 className="font-medium line-clamp-1">{topic.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {topic.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(topic.createdAt).toLocaleDateString(
                          currentLanguage === 'en' ? 'en-US' : 'ru-RU',
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    {t('no_favorites_yet')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
