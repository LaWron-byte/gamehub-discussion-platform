
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from './use-translation';
import { useAuth, User } from './use-auth';

// Типы для форума
export interface Topic {
  id: string;
  title: string;
  content: string;
  userId: string;
  username: string;
  userAvatar?: string;
  category: 'games' | 'industry' | 'offtopic';
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  views: number;
  likes: string[]; // массив ID пользователей, поставивших лайк
  commentsCount: number;
}

export interface Comment {
  id: string;
  topicId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likes: string[]; // массив ID пользователей, поставивших лайк
}

export interface Notification {
  id: string;
  userId: string;
  type: 'comment' | 'like';
  sourceId: string; // ID темы или комментария
  sourceName: string; // Название темы или начало комментария
  sourceType: 'topic' | 'comment';
  actorId: string; // ID пользователя, создавшего уведомление
  actorName: string; // Имя пользователя, создавшего уведомление
  createdAt: string;
  read: boolean;
}

// Интерфейс контекста форума
interface ForumContextType {
  topics: Topic[];
  comments: Comment[];
  notifications: Notification[];
  favorites: string[]; // массив ID избранных тем
  
  // Методы для тем
  getTopics: (category?: string, sortBy?: string, searchQuery?: string) => Topic[];
  getTopic: (id: string) => Topic | undefined;
  createTopic: (title: string, content: string, category: 'games' | 'industry' | 'offtopic', tags: string[]) => Promise<string | undefined>;
  updateTopic: (id: string, data: Partial<Topic>) => Promise<boolean>;
  deleteTopic: (id: string) => Promise<boolean>;
  likeTopic: (id: string) => Promise<boolean>;
  viewTopic: (id: string) => void;
  
  // Методы для комментариев
  getComments: (topicId: string) => Comment[];
  createComment: (topicId: string, content: string) => Promise<boolean>;
  updateComment: (id: string, content: string) => Promise<boolean>;
  deleteComment: (id: string) => Promise<boolean>;
  likeComment: (id: string) => Promise<boolean>;
  
  // Методы для избранного
  toggleFavorite: (topicId: string) => void;
  isFavorite: (topicId: string) => boolean;
  getFavorites: () => Topic[];
  
  // Методы для уведомлений
  getUnreadNotificationsCount: () => number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

// Создание контекста
const ForumContext = createContext<ForumContextType | undefined>(undefined);

// Провайдер для контекста
export const ForumProvider = ({ children }: { children: ReactNode }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Загрузка данных при инициализации
  useEffect(() => {
    // Загрузка тем
    const storedTopics = localStorage.getItem('topics');
    if (storedTopics) {
      try {
        setTopics(JSON.parse(storedTopics));
      } catch (error) {
        console.error('Ошибка при загрузке тем:', error);
      }
    }
    
    // Загрузка комментариев
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      try {
        setComments(JSON.parse(storedComments));
      } catch (error) {
        console.error('Ошибка при загрузке комментариев:', error);
      }
    }
    
    // Загрузка уведомлений
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error('Ошибка при загрузке уведомлений:', error);
      }
    }
    
    // Загрузка избранного
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites));
        } catch (error) {
          console.error('Ошибка при загрузке избранного:', error);
        }
      }
    }
  }, [user?.id]);

  // Сохранение данных при их изменении
  useEffect(() => {
    localStorage.setItem('topics', JSON.stringify(topics));
  }, [topics]);
  
  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);
  
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  useEffect(() => {
    if (user) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user?.id]);

  // Методы для работы с темами
  const getTopics = (category?: string, sortBy = 'dateNewest', searchQuery = '') => {
    let filteredTopics = [...topics];
    
    // Фильтрация по категории
    if (category && category !== 'all') {
      filteredTopics = filteredTopics.filter(topic => topic.category === category);
    }
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTopics = filteredTopics.filter(topic => 
        topic.title.toLowerCase().includes(query) || 
        topic.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Сортировка
    return filteredTopics.sort((a, b) => {
      if (sortBy === 'dateNewest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'dateOldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'mostLiked') {
        return b.likes.length - a.likes.length;
      }
      return 0;
    });
  };
  
  const getTopic = (id: string) => {
    return topics.find(topic => topic.id === id);
  };
  
  const createTopic = async (title: string, content: string, category: 'games' | 'industry' | 'offtopic', tags: string[]): Promise<string | undefined> => {
    try {
      if (!user) throw new Error('You must be logged in to create a topic');
      
      const newTopic: Topic = {
        id: crypto.randomUUID(),
        title,
        content,
        userId: user.id,
        username: user.username,
        userAvatar: user.avatar,
        category,
        tags,
        createdAt: new Date().toISOString(),
        views: 0,
        likes: [],
        commentsCount: 0
      };
      
      setTopics(prev => [...prev, newTopic]);
      
      // Обновляем статистику пользователя
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex].topicsCount += 1;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Если пользователь текущий, обновляем состояние
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify({
            ...user,
            topicsCount: user.topicsCount + 1
          }));
        }
      }
      
      toast({
        title: t('topicCreated'),
      });
      
      return newTopic.id;
    } catch (error) {
      console.error('Ошибка при создании темы:', error);
      toast({
        title: t('errorOccurred'),
        description: String(error),
        variant: 'destructive',
      });
      return undefined;
    }
  };
  
  const updateTopic = async (id: string, data: Partial<Topic>): Promise<boolean> => {
    try {
      const topicIndex = topics.findIndex(t => t.id === id);
      
      if (topicIndex === -1) throw new Error('Topic not found');
      
      const topic = topics[topicIndex];
      
      if (!user || topic.userId !== user.id) {
        throw new Error('You can only edit your own topics');
      }
      
      const updatedTopic = {
        ...topic,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      const newTopics = [...topics];
      newTopics[topicIndex] = updatedTopic;
      
      setTopics(newTopics);
      
      return true;
    } catch (error) {
      console.error('Ошибка при обновлении темы:', error);
      toast({
        title: t('errorOccurred'),
        description: String(error),
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const deleteTopic = async (id: string): Promise<boolean> => {
    try {
      const topic = topics.find(t => t.id === id);
      
      if (!topic) throw new Error('Topic not found');
      
      if (!user || topic.userId !== user.id) {
        throw new Error('You can only delete your own topics');
      }
      
      // Удаляем тему
      setTopics(prev => prev.filter(t => t.id !== id));
      
      // Удаляем комментарии этой темы
      setComments(prev => prev.filter(c => c.topicId !== id));
      
      // Удаляем уведомления, связанные с темой
      setNotifications(prev => prev.filter(n => 
        !(n.sourceType === 'topic' && n.sourceId === id) &&
        !(n.sourceType === 'comment' && comments.some(c => c.id === n.sourceId && c.topicId === id))
      ));
      
      // Обновляем статистику пользователя
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex].topicsCount -= 1;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Если пользователь текущий, обновляем состояние
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify({
            ...user,
            topicsCount: user.topicsCount - 1
          }));
        }
      }
      
      return true;
    } catch (error) {
      console.error('Ошибка при удалении темы:', error);
      toast({
        title: t('errorOccurred'),
        description: String(error),
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const likeTopic = async (id: string): Promise<boolean> => {
    try {
      if (!user) throw new Error('You must be logged in to like a topic');
      
      const topicIndex = topics.findIndex(t => t.id === id);
      
      if (topicIndex === -1) throw new Error('Topic not found');
      
      const topic = topics[topicIndex];
      const isLiked = topic.likes.includes(user.id);
      
      let newLikes: string[];
      
      if (isLiked) {
        // Если уже лайкнута - убираем лайк
        newLikes = topic.likes.filter(userId => userId !== user.id);
      } else {
        // Если не лайкнута - добавляем лайк
        newLikes = [...topic.likes, user.id];
        
        // Создаем уведомление, если это не тема текущего пользователя
        if (topic.userId !== user.id) {
          const newNotification: Notification = {
            id: crypto.randomUUID(),
            userId: topic.userId,
            type: 'like',
            sourceId: topic.id,
            sourceName: topic.title,
            sourceType: 'topic',
            actorId: user.id,
            actorName: user.username,
            createdAt: new Date().toISOString(),
            read: false
          };
          
          setNotifications(prev => [...prev, newNotification]);
          
          // Обновляем статистику пользователя, получившего лайк
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const authorIndex = users.findIndex((u: any) => u.id === topic.userId);
          
          if (authorIndex !== -1) {
            users[authorIndex].likesReceived = (users[authorIndex].likesReceived || 0) + 1;
            localStorage.setItem('users', JSON.stringify(users));
          }
        }
      }
      
      const updatedTopic = {
        ...topic,
        likes: newLikes
      };
      
      const newTopics = [...topics];
      newTopics[topicIndex] = updatedTopic;
      
      setTopics(newTopics);
      
      return true;
    } catch (error) {
      console.error('Ошибка при лайке темы:', error);
      toast({
        title: t('errorOccurred'),
        description: String(error),
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const viewTopic = (id: string) => {
    const topicIndex = topics.findIndex(t => t.id === id);
    
    if (topicIndex !== -1) {
      const topic = topics[topicIndex];
      
      const updatedTopic = {
        ...topic,
        views: topic.views + 1
      };
      
      const newTopics = [...topics];
      newTopics[topicIndex] = updatedTopic;
      
      setTopics(newTopics);
    }
  };
  
  // Методы для комментариев
  const getComments = (topicId: string) => {
    return comments
      .filter(comment => comment.topicId === topicId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };
  
  const createComment = async (topicId: string, content: string): Promise<boolean> => {
    try {
      if (!user) throw new Error('You must be logged in to comment');
      
      const topic = topics.find(t => t.id === topicId);
      if (!topic) throw new Error('Topic not found');
      
      const newComment: Comment = {
        id: crypto.randomUUID(),
        topicId,
        userId: user.id,
        username: user.username,
        userAvatar: user.avatar,
        content,
        createdAt: new Date().toISOString(),
        likes: []
      };
      
      setComments(prev => [...prev, newComment]);
      
      // Обновляем счетчик комментариев в теме
      const topicIndex = topics.findIndex(t => t.id === topicId);
      if (topicIndex !== -1) {
        const updatedTopic = {
          ...topics[topicIndex],
          commentsCount: topics[topicIndex].commentsCount + 1
        };
        
        const newTopics = [...topics];
        newTopics[topicIndex] = updatedTopic;
        
        setTopics(newTopics);
      }
      
      // Создаем уведомление для автора темы, если это не текущий пользователь
      if (topic.userId !== user.id) {
        const newNotification: Notification = {
          id: crypto.randomUUID(),
          userId: topic.userId,
          type: 'comment',
          sourceId: topicId,
          sourceName: topic.title,
          sourceType: 'topic',
          actorId: user.id,
          actorName: user.username,
          createdAt: new Date().toISOString(),
          read: false
        };
        
        setNotifications(prev => [...prev, newNotification]);
      }
      
      // Обновляем статистику пользователя
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex].commentsCount += 1;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Если пользователь текущий, обновляем состояние
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify({
            ...user,
            commentsCount: user.commentsCount + 1
          }));
        }
      }
      
      toast({
        title: t('commentAdded'),
      });
      
      return true;
    } catch (error) {
      console.error('Ошибка при создании комментария:', error);
      toast({
        title: t('errorOccurred'),
        description: String(error),
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const updateComment = async (id: string, content: string): Promise<boolean> => {
    try {
      const commentIndex = comments.findIndex(c => c.id === id);
      
      if (commentIndex === -1) throw new Error('Comment not found');
      
      const comment = comments[commentIndex];
      
      if (!user || comment.userId !== user.id) {
        throw new Error('You can only edit your own comments');
      }
      
      const updatedComment = {
        ...comment,
        content
      };
      
      const newComments = [...comments];
      newComments[commentIndex] = updatedComment;
      
      setComments(newComments);
      
      return true;
    } catch (error) {
      console.error('Ошибка при обновлении комментария:', error);
      toast({
        title: t('errorOccurred'),
        description: String(error),
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const deleteComment = async (id: string): Promise<boolean> => {
    try {
      const comment = comments.find(c => c.id === id);
      
      if (!comment) throw new Error('Comment not found');
      
      if (!user || comment.userId !== user.id) {
        throw new Error('You can only delete your own comments');
      }
      
      // Удаляем комментарий
      setComments(prev => prev.filter(c => c.id !== id));
      
      // Обновляем счетчик комментариев в теме
      const topicIndex = topics.findIndex(t => t.id === comment.topicId);
      if (topicIndex !== -1) {
        const updatedTopic = {
          ...topics[topicIndex],
          commentsCount: Math.max(0, topics[topicIndex].commentsCount - 1)
        };
        
        const newTopics = [...topics];
        newTopics[topicIndex] = updatedTopic;
        
        setTopics(newTopics);
      }
      
      // Удаляем уведомления, связанные с комментарием
      setNotifications(prev => prev.filter(n => 
        !(n.sourceType === 'comment' && n.sourceId === id)
      ));
      
      // Обновляем статистику пользователя
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex].commentsCount = Math.max(0, users[userIndex].commentsCount - 1);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Если пользователь текущий, обновляем состояние
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify({
            ...user,
            commentsCount: Math.max(0, user.commentsCount - 1)
          }));
        }
      }
      
      return true;
    } catch (error) {
      console.error('Ошибка при удалении комментария:', error);
      toast({
        title: t('errorOccurred'),
        description: String(error),
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const likeComment = async (id: string): Promise<boolean> => {
    try {
      if (!user) throw new Error('You must be logged in to like a comment');
      
      const commentIndex = comments.findIndex(c => c.id === id);
      
      if (commentIndex === -1) throw new Error('Comment not found');
      
      const comment = comments[commentIndex];
      const isLiked = comment.likes.includes(user.id);
      
      let newLikes: string[];
      
      if (isLiked) {
        // Если уже лайкнут - убираем лайк
        newLikes = comment.likes.filter(userId => userId !== user.id);
      } else {
        // Если не лайкнут - добавляем лайк
        newLikes = [...comment.likes, user.id];
        
        // Создаем уведомление, если это не комментарий текущего пользователя
        if (comment.userId !== user.id) {
          const topic = topics.find(t => t.id === comment.topicId);
          
          const newNotification: Notification = {
            id: crypto.randomUUID(),
            userId: comment.userId,
            type: 'like',
            sourceId: comment.id,
            sourceName: comment.content.substring(0, 50) + (comment.content.length > 50 ? '...' : ''),
            sourceType: 'comment',
            actorId: user.id,
            actorName: user.username,
            createdAt: new Date().toISOString(),
            read: false
          };
          
          setNotifications(prev => [...prev, newNotification]);
          
          // Обновляем статистику пользователя, получившего лайк
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const authorIndex = users.findIndex((u: any) => u.id === comment.userId);
          
          if (authorIndex !== -1) {
            users[authorIndex].likesReceived = (users[authorIndex].likesReceived || 0) + 1;
            localStorage.setItem('users', JSON.stringify(users));
          }
        }
      }
      
      const updatedComment = {
        ...comment,
        likes: newLikes
      };
      
      const newComments = [...comments];
      newComments[commentIndex] = updatedComment;
      
      setComments(newComments);
      
      return true;
    } catch (error) {
      console.error('Ошибка при лайке комментария:', error);
      toast({
        title: t('errorOccurred'),
        description: String(error),
        variant: 'destructive',
      });
      return false;
    }
  };
  
  // Методы для избранного
  const toggleFavorite = (topicId: string) => {
    if (!user) return;
    
    const isFav = favorites.includes(topicId);
    
    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== topicId));
      toast({
        title: t('removedFromFavorites'),
      });
    } else {
      setFavorites(prev => [...prev, topicId]);
      toast({
        title: t('addedToFavorites'),
      });
    }
  };
  
  const isFavorite = (topicId: string) => {
    return favorites.includes(topicId);
  };
  
  const getFavorites = () => {
    return topics.filter(topic => favorites.includes(topic.id));
  };
  
  // Методы для уведомлений
  const getUnreadNotificationsCount = () => {
    if (!user) return 0;
    return notifications.filter(n => !n.read && n.userId === user.id).length;
  };
  
  const markNotificationAsRead = (id: string) => {
    const notificationIndex = notifications.findIndex(n => n.id === id);
    
    if (notificationIndex !== -1) {
      const updatedNotification = {
        ...notifications[notificationIndex],
        read: true
      };
      
      const newNotifications = [...notifications];
      newNotifications[notificationIndex] = updatedNotification;
      
      setNotifications(newNotifications);
    }
  };
  
  const markAllNotificationsAsRead = () => {
    if (!user) return;
    
    const updatedNotifications = notifications.map(notification => 
      notification.userId === user.id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
  };

  return (
    <ForumContext.Provider
      value={{
        topics,
        comments,
        notifications,
        favorites,
        getTopics,
        getTopic,
        createTopic,
        updateTopic,
        deleteTopic,
        likeTopic,
        viewTopic,
        getComments,
        createComment,
        updateComment,
        deleteComment,
        likeComment,
        toggleFavorite,
        isFavorite,
        getFavorites,
        getUnreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead
      }}
    >
      {children}
    </ForumContext.Provider>
  );
};

// Хук для использования форума
export const useForum = () => {
  const context = useContext(ForumContext);
  if (context === undefined) {
    throw new Error('useForum must be used within a ForumProvider');
  }
  return context;
};
