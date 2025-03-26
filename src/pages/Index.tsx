import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Users, MessageSquare, Heart, Book, Globe, Gamepad2, Monitor } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useForum, Topic } from '@/hooks/use-forum';
import { motion } from 'framer-motion';

const Index = () => {
  const { t, currentLanguage } = useTranslation();
  const { getTopics } = useForum();
  const [latestTopics, setLatestTopics] = useState<Topic[]>([]);
  const [popularTopics, setPopularTopics] = useState<Topic[]>([]);
  const [statistics, setStatistics] = useState({
    users: 0,
    topics: 0,
    comments: 0
  });

  useEffect(() => {
    setLatestTopics(getTopics('all', 'dateNewest').slice(0, 5));
    setPopularTopics(getTopics('all', 'mostLiked').slice(0, 5));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]').length;
    const topics = JSON.parse(localStorage.getItem('topics') || '[]').length;
    const comments = JSON.parse(localStorage.getItem('comments') || '[]').length;
    
    setStatistics({
      users,
      topics,
      comments
    });
  }, [getTopics]);

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
    <div className="container mx-auto px-4 py-12 space-y-16">
      <motion.section 
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">{t('welcome')}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('welcomeSubtitle')}</p>
        
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link 
            to="/forum/games" 
            className="button-primary px-6 py-3 rounded-xl shadow-subtle"
          >
            {t('games')}
          </Link>
          <Link 
            to="/forum/industry" 
            className="button-secondary px-6 py-3 rounded-xl"
          >
            {t('industry')}
          </Link>
          <Link 
            to="/forum/offtopic" 
            className="button-secondary px-6 py-3 rounded-xl"
          >
            {t('offtopic')}
          </Link>
        </div>
      </motion.section>
      
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div 
          variants={itemVariants}
          className="card group hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
            <Gamepad2 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('games')}</h3>
          <p className="text-muted-foreground mb-4">
            {currentLanguage === 'en' 
              ? 'Discuss your favorite games, share tips, and find gaming partners.'
              : 'Обсуждайте любимые игры, делитесь советами и находите напарников для игр.'}
          </p>
          <Link to="/forum/games" className="inline-flex items-center text-primary hover:underline mt-auto">
            {currentLanguage === 'en' ? 'Browse Games' : 'Перейти к играм'} <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="card group hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
            <Monitor className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('industry')}</h3>
          <p className="text-muted-foreground mb-4">
            {currentLanguage === 'en' 
              ? 'Stay updated with the latest gaming industry news and trends.'
              : 'Следите за последними новостями и тенденциями игровой индустрии.'}
          </p>
          <Link to="/forum/industry" className="inline-flex items-center text-primary hover:underline mt-auto">
            {currentLanguage === 'en' ? 'Browse Industry' : 'Перейти к индустрии'} <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="card group hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('offtopic')}</h3>
          <p className="text-muted-foreground mb-4">
            {currentLanguage === 'en' 
              ? 'Chat about anything beyond gaming - tech, movies, and more.'
              : 'Общайтесь на любые темы помимо игр - технологии, фильмы и многое другое.'}
          </p>
          <Link to="/forum/offtopic" className="inline-flex items-center text-primary hover:underline mt-auto">
            {currentLanguage === 'en' ? 'Browse Off-topic' : 'Перейти к оффтопу'} <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </motion.div>
      </motion.section>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.section 
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t('latestTopics')}</h2>
            <Link to="/forum/all" className="text-primary hover:underline">
              {currentLanguage === 'en' ? 'View all' : 'Смотреть все'}
            </Link>
          </div>
          
          <div className="space-y-4">
            {latestTopics.length > 0 ? (
              latestTopics.map((topic) => (
                <Link 
                  key={topic.id} 
                  to={`/topic/${topic.id}`}
                  className="card block hover:shadow-elevated group"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium group-hover:text-primary transition-colors">{topic.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(topic.createdAt).toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'ru-RU')}
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
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {currentLanguage === 'en' ? 'No topics yet' : 'Пока нет тем'}
              </div>
            )}
          </div>
        </motion.section>
        
        <motion.section 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t('popularTopics')}</h2>
            <Link to="/forum/all" className="text-primary hover:underline">
              {currentLanguage === 'en' ? 'View all' : 'Смотреть все'}
            </Link>
          </div>
          
          <div className="space-y-4">
            {popularTopics.length > 0 ? (
              popularTopics.map((topic) => (
                <Link 
                  key={topic.id} 
                  to={`/topic/${topic.id}`}
                  className="card block hover:shadow-elevated group"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium group-hover:text-primary transition-colors">{topic.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {topic.likes.length} {currentLanguage === 'en' ? 'likes' : 'лайков'}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center mr-4">
                      <Users className="h-4 w-4 mr-1" />
                      {topic.username}
                    </span>
                    <span className="inline-flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {topic.commentsCount}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {currentLanguage === 'en' ? 'No topics yet' : 'Пока нет тем'}
              </div>
            )}
          </div>
        </motion.section>
      </div>
      
      <motion.section 
        className="py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-center mb-12">{t('statistics')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-full bg-primary/10 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">{statistics.users}</h3>
            <p className="text-muted-foreground">{t('users')}</p>
          </div>
          
          <div className="card text-center">
            <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-full bg-primary/10 mb-4">
              <Book className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">{statistics.topics}</h3>
            <p className="text-muted-foreground">{t('topics')}</p>
          </div>
          
          <div className="card text-center">
            <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-full bg-primary/10 mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">{statistics.comments}</h3>
            <p className="text-muted-foreground">{t('comments')}</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Index;
