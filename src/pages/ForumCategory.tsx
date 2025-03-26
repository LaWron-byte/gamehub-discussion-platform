
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from '@/hooks/use-translation';
import { useForum, Topic } from '@/hooks/use-forum';
import { MessageSquare, Heart, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ForumCategory = () => {
  const { category } = useParams();
  const { t, currentLanguage } = useTranslation();
  const { getTopics } = useForum();
  const [topics, setTopics] = useState<Topic[]>([]);
  
  useEffect(() => {
    if (category) {
      if (category === 'all') {
        setTopics(getTopics('all', 'dateNewest'));
      } else {
        setTopics(getTopics(category, 'dateNewest'));
      }
    }
  }, [category, getTopics]);
  
  // Get category name for display
  const getCategoryName = () => {
    if (!category) return '';
    
    switch(category) {
      case 'games':
        return currentLanguage === 'en' ? 'Games' : 'Игры';
      case 'industry':
        return currentLanguage === 'en' ? 'Industry' : 'Индустрия';
      case 'offtopic':
        return currentLanguage === 'en' ? 'Off-Topic' : 'Оффтоп';
      case 'all':
        return currentLanguage === 'en' ? 'All Discussions' : 'Все обсуждения';
      default:
        return category;
    }
  };
  
  // Get category description
  const getCategoryDescription = () => {
    if (!category) return '';
    
    switch(category) {
      case 'games':
        return currentLanguage === 'en' 
          ? 'Discuss your favorite games, share tips, and find gaming partners.'
          : 'Обсуждайте любимые игры, делитесь советами и находите напарников для игр.';
      case 'industry':
        return currentLanguage === 'en' 
          ? 'Talk about the latest gaming industry news, trends, and events.'
          : 'Обсуждайте последние новости игровой индустрии, тенденции и события.';
      case 'offtopic':
        return currentLanguage === 'en' 
          ? 'Chat about anything beyond gaming - tech, movies, TV shows, and more.'
          : 'Общайтесь на любые темы помимо игр - технологии, фильмы, сериалы и многое другое.';
      case 'all':
        return currentLanguage === 'en' 
          ? 'Browse all discussions across all categories.'
          : 'Просматривайте все обсуждения по всем категориям.';
      default:
        return '';
    }
  };
  
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
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="w-full md:w-2/3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold mb-2">{getCategoryName()}</h1>
            <p className="text-muted-foreground mb-6">{getCategoryDescription()}</p>
            
            <Link to="/create-topic">
              <Button className="mb-6">
                {t('create_new_topic')}
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {topics.length > 0 ? (
              topics.map((topic) => (
                <motion.div key={topic.id} variants={itemVariants}>
                  <Link 
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
                        <Users className="h-4 w-4 mr-1" />
                        {topic.username}
                      </span>
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
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    {currentLanguage === 'en' 
                      ? 'No topics yet. Be the first to create a topic in this category!'
                      : 'Пока нет тем. Станьте первым, кто создаст тему в этой категории!'}
                  </p>
                  <Link to="/create-topic" className="mt-4 inline-block">
                    <Button variant="outline" className="mt-2">
                      {t('create_topic')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
        
        <div className="w-full md:w-1/3 md:sticky md:top-24">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{currentLanguage === 'en' ? 'About This Category' : 'Об этой категории'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{getCategoryDescription()}</p>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{currentLanguage === 'en' ? 'Topics:' : 'Темы:'}</span>
                  <span>{topics.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{currentLanguage === 'en' ? 'Community Stats' : 'Статистика сообщества'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    {currentLanguage === 'en' ? 'Members' : 'Участники'}
                  </span>
                  <span className="text-sm font-medium">
                    {JSON.parse(localStorage.getItem('users') || '[]').length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center text-sm">
                    <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                    {currentLanguage === 'en' ? 'Topics' : 'Темы'}
                  </span>
                  <span className="text-sm font-medium">
                    {JSON.parse(localStorage.getItem('topics') || '[]').length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center text-sm">
                    <Heart className="h-4 w-4 mr-2 text-primary" />
                    {currentLanguage === 'en' ? 'Comments' : 'Комментарии'}
                  </span>
                  <span className="text-sm font-medium">
                    {JSON.parse(localStorage.getItem('comments') || '[]').length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    {currentLanguage === 'en' ? 'Active Since' : 'Активен с'}
                  </span>
                  <span className="text-sm font-medium">
                    2023
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForumCategory;
