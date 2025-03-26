
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

type ReportDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  topicTitle: string;
};

export const ReportDialog = ({ isOpen, onClose, topicId, topicTitle }: ReportDialogProps) => {
  const { t, currentLanguage } = useTranslation();
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate submission to API
    setTimeout(() => {
      console.log('Reporting topic', { topicId, reason });
      
      toast({
        title: currentLanguage === 'en' ? 'Report Submitted' : 'Жалоба отправлена',
        description: t('reportSuccess'),
      });
      
      setIsSubmitting(false);
      setReason('');
      onClose();
    }, 1000);
  };
  
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
            className="bg-card rounded-xl shadow-elevated border border-border w-full max-w-md overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">{t('reportTopic')}</h3>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-secondary transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {currentLanguage === 'en' 
                    ? 'Topic:' 
                    : 'Тема:'} <span className="text-foreground">{topicTitle}</span>
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="report-reason" className="block text-sm font-medium mb-1">
                  {t('reportReason')}
                </label>
                <textarea
                  id="report-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={currentLanguage === 'en' 
                    ? 'Please explain why you are reporting this topic...' 
                    : 'Пожалуйста, объясните, почему вы сообщаете об этой теме...'}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md hover:bg-secondary transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={!reason.trim() || isSubmitting}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('submit')}...
                    </span>
                  ) : (
                    t('submit')
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
