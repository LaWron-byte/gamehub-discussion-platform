
import React, { useState, useEffect } from 'react';
import { Moon, Sun, User, Search, Bell, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { LanguageToggle } from './LanguageToggle';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn, logout } = useAuth();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Check if user has notifications
  useEffect(() => {
    if (isLoggedIn) {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      setHasNotifications(notifications.filter(n => !n.read && n.userId === user?.id).length > 0);
    }
  }, [isLoggedIn, user]);
  
  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${
      isScrolled ? 'backdrop-blur-xl bg-background/80 shadow-subtle' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-lg md:text-xl font-heading font-bold animate-pulse-subtle">
              GameHub
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/forum/games" className="text-foreground/80 hover:text-foreground transition-colors">
              {t('games')}
            </Link>
            <Link to="/forum/industry" className="text-foreground/80 hover:text-foreground transition-colors">
              {t('industry')}
            </Link>
            <Link to="/forum/offtopic" className="text-foreground/80 hover:text-foreground transition-colors">
              {t('offtopic')}
            </Link>
          </nav>
          
          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              aria-label="Search" 
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Search size={20} />
            </button>
            
            <button 
              aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')} 
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <LanguageToggle />
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/notifications" 
                  className="relative p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <Bell size={20} />
                  {hasNotifications && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                  )}
                </Link>
                
                <div className="relative">
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <User size={18} className="text-primary" />
                      )}
                    </div>
                    <span className="font-medium">{user?.username}</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg text-foreground/90 hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {t('login')}
                </Link>
                <Link 
                  to="/register" 
                  className="button-primary px-4 py-2"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animated-fade-in">
          <div className="px-4 py-4 space-y-4 bg-background/95 backdrop-blur-lg border-t border-border shadow-elevated">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/forum/games" 
                className="px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('games')}
              </Link>
              <Link 
                to="/forum/industry" 
                className="px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('industry')}
              </Link>
              <Link 
                to="/forum/offtopic" 
                className="px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('offtopic')}
              </Link>
            </nav>
            
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-4">
                <button 
                  aria-label="Search" 
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <Search size={20} />
                </button>
                
                <button 
                  aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')} 
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                <LanguageToggle />
                
                {isLoggedIn && (
                  <Link 
                    to="/notifications" 
                    className="relative p-2 rounded-full hover:bg-secondary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Bell size={20} />
                    {hasNotifications && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                    )}
                  </Link>
                )}
              </div>
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <User size={18} className="text-primary" />
                      )}
                    </div>
                    <span className="font-medium">{user?.username}</span>
                  </Link>
                  
                  <button 
                    onClick={logout}
                    className="px-4 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-lg text-foreground/90 hover:text-foreground hover:bg-secondary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('login')}
                  </Link>
                  <Link 
                    to="/register" 
                    className="button-primary px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
