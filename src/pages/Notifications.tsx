
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'react-router-dom';
import { Check, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

// Demo notification type
type Notification = {
  id: string;
  userId: string;
  read: boolean;
  type: 'like' | 'comment' | 'mention' | 'system';
  message: string;
  link?: string;
  createdAt: Date;
};

const Notifications = () => {
  const { t, currentLanguage } = useTranslation();
  const { user, isLoggedIn } = useAuth();
  const [loading] = useState(false);
  
  // In a real app, this would come from an API or local storage
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const markAllAsRead = () => {
    // In a real app, this would update in the database
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('notifications')}</h1>
          <p className="text-muted-foreground mb-6">
            {currentLanguage === 'en'
              ? 'Please log in to view your notifications'
              : 'Пожалуйста, войдите, чтобы просмотреть уведомления'}
          </p>
          <Link to="/login" className="button-primary px-6 py-2">
            {t('login')}
          </Link>
        </div>
      </div>
    );
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('notifications')}</h1>
        
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm flex items-center hover:text-primary transition-colors"
          >
            <Check size={14} className="mr-1" />
            {t('markAllAsRead')}
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : notifications.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {notifications.map(notification => (
            <motion.div key={notification.id} variants={itemVariants}>
              <Link to={notification.link || '#'}>
                <Card className={`transition-colors hover:bg-secondary/20 ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!notification.read ? 'bg-primary/10' : 'bg-secondary'}`}>
                        <Bell size={18} className={!notification.read ? 'text-primary' : 'text-muted-foreground'} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-muted-foreground'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.createdAt).toLocaleDateString(
                            currentLanguage === 'en' ? 'en-US' : 'ru-RU', 
                            { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('your_notifications')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Bell size={40} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('no_notifications_yet')}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notifications;
