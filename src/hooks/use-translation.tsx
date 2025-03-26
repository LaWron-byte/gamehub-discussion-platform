
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Доступные языки
type Language = 'en' | 'ru';

// Словари с переводами
const translations = {
  en: {
    // Общие фразы
    games: 'Games',
    industry: 'Industry',
    offtopic: 'Off-topic',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    search: 'Search',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    openMenu: 'Open Menu',
    closeMenu: 'Close Menu',
    
    // Главная страница
    welcome: 'Welcome to GameHub',
    welcomeSubtitle: 'A community for gamers',
    latestTopics: 'Latest Topics',
    popularTopics: 'Popular Topics',
    statistics: 'Community Statistics',
    users: 'Users',
    topics: 'Topics',
    comments: 'Comments',
    
    // Навигация
    home: 'Home',
    discussions: 'Discussions',
    
    // Авторизация
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    registerNow: 'Register Now',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    forgotPassword: 'Forgot Password?',
    
    // Профиль
    profile: 'Profile',
    editProfile: 'Edit Profile',
    memberSince: 'Member since',
    topicsCreated: 'Topics created',
    commentsPosted: 'Comments posted',
    likesReceived: 'Likes received',
    bio: 'Bio',
    avatar: 'Avatar',
    save: 'Save',
    cancel: 'Cancel',
    
    // Форум
    create_topic: 'Create Topic',
    create_new_topic: 'Create New Topic',
    topic_details: 'Topic Details',
    topicTitle: 'Topic Title',
    title: 'Title',
    topicContent: 'Topic Content',
    content: 'Content',
    category: 'Category',
    tags: 'Tags (separated by commas)',
    publish: 'Publish',
    sortBy: 'Sort by',
    dateNewest: 'Date (newest)',
    dateOldest: 'Date (oldest)',
    mostLiked: 'Most liked',
    addComment: 'Add Comment',
    writeComment: 'Write a comment...',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    report: 'Report',
    post_comment: 'Post Comment',
    
    // Уведомления
    notifications: 'Notifications',
    noNotifications: 'No notifications',
    markAllAsRead: 'Mark all as read',
    
    // Избранное
    favorites: 'Favorites',
    noFavorites: 'No favorites yet',
    
    // Ошибки и сообщения
    errorOccurred: 'An error occurred',
    required: 'This field is required',
    invalidEmail: 'Invalid email address',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordsDontMatch: 'Passwords don\'t match',
    usernameTaken: 'Username is already taken',
    loginSuccess: 'Login successful',
    registerSuccess: 'Registration successful',
    logoutSuccess: 'Logout successful',
    profileUpdated: 'Profile updated successfully',
    topicCreated: 'Topic created successfully',
    commentAdded: 'Comment added successfully',
    addedToFavorites: 'Added to favorites',
    removedFromFavorites: 'Removed from favorites',
    
    // Футер
    follow_us: 'Follow us',
    allRightsReserved: 'All rights reserved.',
    
    // Отчеты
    reportTopic: 'Report Topic',
    reportReason: 'Reason',
    submit: 'Submit',
    reportSuccess: 'Thank you for your report. We will review it shortly.',
  },
  ru: {
    // Общие фразы
    games: 'Игры',
    industry: 'Индустрия',
    offtopic: 'Оффтоп',
    login: 'Вход',
    register: 'Регистрация',
    logout: 'Выход',
    search: 'Поиск',
    darkMode: 'Тёмная тема',
    lightMode: 'Светлая тема',
    openMenu: 'Открыть меню',
    closeMenu: 'Закрыть меню',
    
    // Главная страница
    welcome: 'Добро пожаловать на GameHub',
    welcomeSubtitle: 'Сообщество для геймеров',
    latestTopics: 'Последние темы',
    popularTopics: 'Популярные темы',
    statistics: 'Статистика сообщества',
    users: 'Пользователи',
    topics: 'Темы',
    comments: 'Комментарии',
    
    // Навигация
    home: 'Главная',
    discussions: 'Обсуждения',
    
    // Авторизация
    username: 'Имя пользователя',
    email: 'Email',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    registerNow: 'Зарегистрироваться',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    dontHaveAccount: 'Нет аккаунта?',
    forgotPassword: 'Забыли пароль?',
    
    // Профиль
    profile: 'Профиль',
    editProfile: 'Редактировать профиль',
    memberSince: 'Участник с',
    topicsCreated: 'Создано тем',
    commentsPosted: 'Оставлено комментариев',
    likesReceived: 'Получено лайков',
    bio: 'О себе',
    avatar: 'Аватар',
    save: 'Сохранить',
    cancel: 'Отмена',
    
    // Форум
    create_topic: 'Создать тему',
    create_new_topic: 'Создать новую тему',
    topic_details: 'Детали темы',
    topicTitle: 'Заголовок темы',
    title: 'Заголовок',
    topicContent: 'Содержание темы',
    content: 'Содержание',
    category: 'Категория',
    tags: 'Теги (через запятую)',
    publish: 'Опубликовать',
    sortBy: 'Сортировать по',
    dateNewest: 'Дате (новые)',
    dateOldest: 'Дате (старые)',
    mostLiked: 'Популярности',
    addComment: 'Добавить комментарий',
    writeComment: 'Напишите комментарий...',
    addToFavorites: 'Добавить в избранное',
    removeFromFavorites: 'Удалить из избранного',
    report: 'Пожаловаться',
    post_comment: 'Отправить комментарий',
    
    // Уведомления
    notifications: 'Уведомления',
    noNotifications: 'Нет уведомлений',
    markAllAsRead: 'Отметить все как прочитанные',
    
    // Избранное
    favorites: 'Избранное',
    noFavorites: 'В избранном пока ничего нет',
    
    // Ошибки и сообщения
    errorOccurred: 'Произошла ошибка',
    required: 'Это поле обязательно',
    invalidEmail: 'Некорректный email',
    passwordTooShort: 'Пароль должен быть не менее 6 символов',
    passwordsDontMatch: 'Пароли не совпадают',
    usernameTaken: 'Это имя пользователя уже занято',
    loginSuccess: 'Вход выполнен успешно',
    registerSuccess: 'Регистрация выполнена успешно',
    logoutSuccess: 'Выход выполнен успешно',
    profileUpdated: 'Профиль успешно обновлен',
    topicCreated: 'Тема успешно создана',
    commentAdded: 'Комментарий успешно добавлен',
    addedToFavorites: 'Добавлено в избранное',
    removedFromFavorites: 'Удалено из избранного',
    
    // Футер
    follow_us: 'Присоединяйтесь к нам',
    allRightsReserved: 'Все права защищены.',
    
    // Отчеты
    reportTopic: 'Пожаловаться на тему',
    reportReason: 'Причина',
    submit: 'Отправить',
    reportSuccess: 'Спасибо за вашу жалобу. Мы рассмотрим ее в ближайшее время.',
  }
};

// Интерфейс контекста
interface TranslationContextType {
  t: (key: string) => string;
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
}

// Создание контекста
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Провайдер для контекста
export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  // Инициализация языка из localStorage или по умолчанию
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'en';
  });

  // Функция для получения перевода по ключу
  const t = (key: string): string => {
    // Проверяем наличие ключа в словаре
    return (translations[currentLanguage] as any)[key] || key;
  };

  // Функция для изменения языка
  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // Обновляем язык в localStorage при его изменении
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  return (
    <TranslationContext.Provider value={{ t, currentLanguage, changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Хук для использования переводов
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
