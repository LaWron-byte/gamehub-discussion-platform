
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/use-auth';
import { useForum } from '@/hooks/use-forum';
import { Edit, MessageSquare, Book, Heart, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { FavoriteDialog } from '@/components/FavoriteDialog';

const Profile = () => {
  const { t, currentLanguage } = useTranslation();
  const { user } = useAuth();
  const { getTopics, getFavorites } = useForum();
  const [isFavoriteDialogOpen, setIsFavoriteDialogOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {currentLanguage === 'en' ? 'Please log in to view your profile' : 'Пожалуйста, войдите для просмотра профиля'}
          </h2>
          <Link to="/login" className="button-primary px-6 py-2">
            {t('login')}
          </Link>
        </div>
      </div>
    );
  }

  const userTopics = getTopics().filter(topic => topic.userId === user.id);
  const userFavorites = getFavorites();

  // Анимации
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
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        {/* Профиль */}
        <motion.div variants={itemVariants} className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-semibold text-primary">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div className="ml-6">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-muted-foreground">
                  {t('memberSince')}: {new Date(user.registrationDate).toLocaleDateString(
                    currentLanguage === 'en' ? 'en-US' : 'ru-RU',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </p>
                {user.bio && (
                  <p className="mt-2 text-muted-foreground">{user.bio}</p>
                )}
              </div>
            </div>
            <Link 
              to="/profile/edit"
              className="button-secondary inline-flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              {t('editProfile')}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-secondary/30 p-4 rounded-lg text-center">
              <Book className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xl font-bold">{userTopics.length}</div>
              <div className="text-xs text-muted-foreground">{t('topicsCreated')}</div>
            </div>
            <div className="bg-secondary/30 p-4 rounded-lg text-center">
              <MessageSquare className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xl font-bold">{user.commentsCount}</div>
              <div className="text-xs text-muted-foreground">{t('commentsPosted')}</div>
            </div>
            <div className="bg-secondary/30 p-4 rounded-lg text-center">
              <Heart className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xl font-bold">{user.likesReceived}</div>
              <div className="text-xs text-muted-foreground">{t('likesReceived')}</div>
            </div>
            <button 
              onClick={() => setIsFavoriteDialogOpen(true)}
              className="bg-secondary/30 p-4 rounded-lg text-center hover:bg-secondary/50 transition-colors"
            >
              <Bookmark className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xl font-bold">{userFavorites.length}</div>
              <div className="text-xs text-muted-foreground">{t('favorites')}</div>
            </button>
          </div>
        </motion.div>

        {/* Темы пользователя */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">{t('topics')}</h2>
          
          {userTopics.length > 0 ? (
            <div className="space-y-4">
              {userTopics.map(topic => (
                <Link 
                  key={topic.id}
                  to={`/topic/${topic.id}`}
                  className="card block hover:shadow-elevated group"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {topic.title}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(topic.createdAt).toLocaleDateString(
                        currentLanguage === 'en' ? 'en-US' : 'ru-RU'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center mr-4">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {topic.commentsCount}
                    </span>
                    <span className="inline-flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {topic.likes.length}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {currentLanguage === 'en' ? 'No topics created yet' : 'Пока нет созданных тем'}
            </div>
          )}
        </motion.div>
      </motion.div>
      
      {/* Favorites Dialog */}
      <FavoriteDialog 
        isOpen={isFavoriteDialogOpen}
        onClose={() => setIsFavoriteDialogOpen(false)}
        userId={user.id}
      />
    </div>
  );
};

export default Profile;
