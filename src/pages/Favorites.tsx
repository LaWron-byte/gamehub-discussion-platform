
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from '@/hooks/use-translation';
import { useForum } from '@/hooks/use-forum';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'react-router-dom';
import { MessageSquare, Heart, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const Favorites = () => {
  const { t, currentLanguage } = useTranslation();
  const { getFavorites } = useForum();
  const { user, isLoggedIn } = useAuth();
  const [loading] = useState(false);
  
  const favorites = user ? getFavorites(user.id) : [];
  
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('favorites')}</h1>
          <p className="text-muted-foreground mb-6">
            {currentLanguage === 'en'
              ? 'Please log in to view your favorites'
              : 'Пожалуйста, войдите, чтобы просмотреть избранное'}
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
      <h1 className="text-3xl font-bold mb-6">{t('favorites')}</h1>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : favorites.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {favorites.map(topic => (
            <motion.div key={topic.id} variants={itemVariants}>
              <Link to={`/topic/${topic.id}`} className="block">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2">{topic.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {topic.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <MessageSquare size={14} className="mr-1" /> 
                          {topic.comments?.length || 0}
                        </span>
                        <span className="flex items-center">
                          <Heart size={14} className="mr-1" /> 
                          {topic.likes?.length || 0}
                        </span>
                      </div>
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(topic.createdAt).toLocaleDateString(
                          currentLanguage === 'en' ? 'en-US' : 'ru-RU', 
                          { month: 'short', day: 'numeric' }
                        )}
                      </span>
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
            <CardTitle>{t('your_favorite_topics')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">{t('no_favorites_yet')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Favorites;
