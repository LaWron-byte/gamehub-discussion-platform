
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

export const LanguageToggle = () => {
  const { currentLanguage, changeLanguage } = useTranslation();

  return (
    <div className="relative">
      <button 
        className="p-2 rounded-lg hover:bg-secondary transition-colors flex items-center space-x-1"
        onClick={() => changeLanguage(currentLanguage === 'en' ? 'ru' : 'en')}
      >
        <span className="text-sm font-medium uppercase">{currentLanguage}</span>
      </button>
    </div>
  );
};
