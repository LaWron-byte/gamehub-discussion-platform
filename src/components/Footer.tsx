
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { MessageCircle, Mail, Twitter, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const { t, currentLanguage } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card border-t border-border mt-16 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl font-heading font-bold">GameHub</span>
              <span className="text-sm text-muted-foreground">&copy; {currentYear}</span>
              <span className="text-sm text-muted-foreground">{t('allRightsReserved')}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              {currentLanguage === 'en' 
                ? 'The community for gamers to discuss the latest games, industry news, and more.'
                : 'Сообщество для геймеров, где обсуждаются последние игры, новости индустрии и многое другое.'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4 text-center md:text-right">
              {t('follow_us')}
            </h3>
            <div className="flex items-center space-x-4">
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Discord"
              >
                <MessageCircle size={20} />
              </a>
              <a 
                href="https://telegram.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Telegram"
              >
                <Mail size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Twitter/X"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://vk.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="VKontakte"
              >
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
