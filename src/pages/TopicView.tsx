
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/use-auth';
import { useForum } from '@/hooks/use-forum';
import { Heart, MessageSquare, User, ChevronLeft, Bookmark, Share, Flag, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';

const TopicView = () => {
  const { id } = useParams();
  const { t, currentLanguage } = useTranslation();
  const { user, isLoggedIn } = useAuth();
  const { getTopic, getComments, addComment, likeTopic, addToFavorites, isInFavorites } = useForum();
  
  const [topic, setTopic] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  useEffect(() => {
    if (id) {
      const fetchedTopic = getTopic(id);
      setTopic(fetchedTopic);
      
      if (fetchedTopic) {
        setComments(getComments(id));
        setIsFavorite(isInFavorites(id));
        
        if (isLoggedIn && user) {
          setIsLiked(fetchedTopic.likes.includes(user.id));
        }
      }
    }
  }, [id, getTopic, getComments, isInFavorites, isLoggedIn, user]);
  
  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-3xl font-bold mb-6">{t('topic_not_found')}</h1>
        <Link to="/forum/all">
          <Button variant="outline">
            {currentLanguage === 'en' ? 'Go Back to Forum' : 'Вернуться на форум'}
          </Button>
        </Link>
      </div>
    );
  }
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn || !newComment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const comment = await addComment(topic.id, newComment);
      
      if (comment) {
        setComments([...comments, comment]);
        setNewComment('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLike = () => {
    if (!isLoggedIn) return;
    
    const updatedTopic = likeTopic(topic.id);
    
    if (updatedTopic) {
      setTopic(updatedTopic);
      setIsLiked(updatedTopic.likes.includes(user?.id || ''));
    }
  };
  
  const handleFavorite = () => {
    if (!isLoggedIn) return;
    
    const newFavoriteState = addToFavorites(topic.id);
    setIsFavorite(newFavoriteState);
  };
  
  // Helper function to format text with basic formatting
  const formatText = (text: string) => {
    // Bold
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Spoiler
    formattedText = formattedText.replace(/\|\|(.*?)\|\|/g, '<span class="spoiler">$1</span>');
    
    // New lines
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    return formattedText;
  };
  
  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link to={`/forum/${topic.category}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
                <ChevronLeft className="h-4 w-4 mr-1" />
                {currentLanguage === 'en' ? 'Back to ' : 'Назад в '}
                {(() => {
                  switch(topic.category) {
                    case 'games': return currentLanguage === 'en' ? 'Games' : 'Игры';
                    case 'industry': return currentLanguage === 'en' ? 'Industry' : 'Индустрия';
                    case 'offtopic': return currentLanguage === 'en' ? 'Off-Topic' : 'Оффтоп';
                    default: return topic.category;
                  }
                })()}
              </Link>
              
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl">{topic.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={handleFavorite}
                        className={`p-2 rounded-full hover:bg-secondary transition-colors ${isFavorite ? 'text-primary' : ''}`}
                        aria-label={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
                      >
                        <Bookmark size={20} className={isFavorite ? 'fill-primary' : ''} />
                      </button>
                      <button 
                        className="p-2 rounded-full hover:bg-secondary transition-colors"
                        aria-label={t('share')}
                      >
                        <Share size={20} />
                      </button>
                      <button 
                        className="p-2 rounded-full hover:bg-secondary transition-colors"
                        aria-label={t('report')}
                      >
                        <Flag size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center mr-2">
                        {topic.avatar ? (
                          <img src={topic.avatar} alt={topic.username} className="w-full h-full object-cover" />
                        ) : (
                          <User size={14} className="text-primary" />
                        )}
                      </div>
                      <span className="font-medium">{topic.username}</span>
                    </div>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(topic.createdAt).toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'ru-RU')}
                    </span>
                    {topic.tags && topic.tags.length > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <div className="flex items-center space-x-1">
                          {topic.tags.map((tag: string, index: number) => (
                            <span key={index} className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatText(topic.content) }}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={handleLike}
                      className={`flex items-center space-x-1 ${isLiked ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}
                      disabled={!isLoggedIn}
                    >
                      <Heart size={20} className={isLiked ? 'fill-primary' : ''} />
                      <span>{topic.likes.length}</span>
                    </button>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MessageSquare size={20} />
                      <span>{comments.length}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              <h2 className="text-xl font-semibold mb-4">{comments.length > 0 ? t('comments') : t('no_comments_yet')}</h2>
              
              {comments.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="space-y-4 mb-6"
                >
                  {comments.map((comment: any) => (
                    <Card key={comment.id}>
                      <CardContent className="py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                              <User size={16} className="text-primary" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center">
                              <span className="font-medium">{comment.username}</span>
                              <span className="mx-2 text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'ru-RU')}
                              </span>
                            </div>
                            <div 
                              className="mt-2 text-sm"
                              dangerouslySetInnerHTML={{ __html: formatText(comment.content) }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              )}
              
              {isLoggedIn ? (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('add_comment')}</CardTitle>
                  </CardHeader>
                  <form onSubmit={handleSubmitComment}>
                    <CardContent>
                      <Textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={currentLanguage === 'en' ? 'Write your comment here...' : 'Напишите свой комментарий здесь...'}
                        rows={4}
                      />
                      <div className="text-xs text-muted-foreground mt-2">
                        {currentLanguage === 'en' 
                          ? 'You can use basic formatting: **bold**, *italic*, ||spoiler||' 
                          : 'Вы можете использовать базовое форматирование: **жирный**, *курсив*, ||спойлер||'}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button 
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {currentLanguage === 'en' ? 'Posting...' : 'Отправка...'}
                          </span>
                        ) : (
                          t('post_comment')
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              ) : (
                <Card className="text-center p-6 mb-6">
                  <p className="text-muted-foreground mb-4">
                    {currentLanguage === 'en' 
                      ? 'You need to be logged in to comment.' 
                      : 'Вы должны войти в систему, чтобы комментировать.'}
                  </p>
                  <Link to="/login">
                    <Button variant="outline">
                      {t('login')}
                    </Button>
                  </Link>
                </Card>
              )}
            </motion.div>
          </div>
          
          <div className="w-full md:w-1/3 md:sticky md:top-24">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{currentLanguage === 'en' ? 'About the Author' : 'Об авторе'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                    <User size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{topic.username}</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentLanguage === 'en' ? 'Member since 2022' : 'Участник с 2022 года'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{currentLanguage === 'en' ? 'Topics:' : 'Темы:'}</span>
                    <span>15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{currentLanguage === 'en' ? 'Comments:' : 'Комментарии:'}</span>
                    <span>42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{currentLanguage === 'en' ? 'Likes received:' : 'Полученные лайки:'}</span>
                    <span>128</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{currentLanguage === 'en' ? 'Similar Topics' : 'Похожие темы'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b border-border pb-3">
                  <Link to="#" className="hover:text-primary transition-colors">
                    <h3 className="font-medium mb-1">{currentLanguage === 'en' 
                      ? 'The evolution of gaming in the last decade' 
                      : 'Эволюция игр за последнее десятилетие'}</h3>
                  </Link>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>GameExpert</span>
                    <span className="mx-1">•</span>
                    <span>12 {currentLanguage === 'en' ? 'comments' : 'комментариев'}</span>
                  </div>
                </div>
                
                <div className="border-b border-border pb-3">
                  <Link to="#" className="hover:text-primary transition-colors">
                    <h3 className="font-medium mb-1">{currentLanguage === 'en' 
                      ? 'What makes a game truly memorable?' 
                      : 'Что делает игру по-настоящему запоминающейся?'}</h3>
                  </Link>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>StoryLover</span>
                    <span className="mx-1">•</span>
                    <span>8 {currentLanguage === 'en' ? 'comments' : 'комментариев'}</span>
                  </div>
                </div>
                
                <div>
                  <Link to="#" className="hover:text-primary transition-colors">
                    <h3 className="font-medium mb-1">{currentLanguage === 'en' 
                      ? 'Gaming communities: toxic or supportive?' 
                      : 'Игровые сообщества: токсичные или поддерживающие?'}</h3>
                  </Link>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>CommunityBuilder</span>
                    <span className="mx-1">•</span>
                    <span>23 {currentLanguage === 'en' ? 'comments' : 'комментариев'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TopicView;
