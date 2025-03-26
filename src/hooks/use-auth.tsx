
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from './use-translation';

// Тип для пользователя
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  registrationDate: string;
  topicsCount: number;
  commentsCount: number;
  likesReceived: number;
}

// Интерфейс контекста аутентификации
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

// Создание контекста
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер для контекста
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Загрузка данных пользователя при инициализации
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Ошибка при разборе данных пользователя из localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Функция входа
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Получаем список пользователей
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Находим пользователя с указанным email
      const foundUser = users.find((u: any) => u.email === email);
      
      // Проверяем существование пользователя и соответствие пароля
      if (!foundUser) {
        toast({
          title: t('errorOccurred'),
          description: 'User not found',
          variant: 'destructive',
        });
        return false;
      }
      
      if (foundUser.password !== password) {
        toast({
          title: t('errorOccurred'),
          description: 'Invalid password',
          variant: 'destructive',
        });
        return false;
      }
      
      // Удаляем пароль из объекта пользователя перед сохранением в состоянии
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Сохраняем пользователя в состоянии и localStorage
      setUser(userWithoutPassword);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      toast({
        title: t('loginSuccess'),
      });
      
      return true;
    } catch (error) {
      console.error('Ошибка при входе:', error);
      toast({
        title: t('errorOccurred'),
        description: String(error),
        variant: 'destructive',
      });
      return false;
    }
  };

  // Функция регистрации
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Получаем список пользователей
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Проверяем уникальность имени пользователя и email
      if (users.some((u: any) => u.username === username)) {
        toast({
          title: t('errorOccurred'),
          description: t('usernameTaken'),
          variant: 'destructive',
        });
        return false;
      }
      
      if (users.some((u: any) => u.email === email)) {
        toast({
          title: t('errorOccurred'),
          description: 'Email is already in use',
          variant: 'destructive',
        });
        return false;
      }
      
      // Создаем нового пользователя
      const newUser = {
        id: crypto.randomUUID(),
        username,
        email,
        password,
        registrationDate: new Date().toISOString(),
        topicsCount: 0,
        commentsCount: 0,
        likesReceived: 0,
      };
      
      // Добавляем пользователя в список и сохраняем
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Удаляем пароль из объекта пользователя перед сохранением в состоянии
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Сохраняем пользователя в состоянии и localStorage
      setUser(userWithoutPassword);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      toast({
        title: t('registerSuccess'),
      });
      
      return true;
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      toast({
        title: t('errorOccurred'),
        description: String(error),
        variant: 'destructive',
      });
      return false;
    }
  };

  // Функция выхода
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
    
    toast({
      title: t('logoutSuccess'),
    });
  };

  // Функция обновления профиля
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Получаем список пользователей
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Находим индекс текущего пользователя
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex === -1) {
        toast({
          title: t('errorOccurred'),
          description: 'User not found',
          variant: 'destructive',
        });
        return false;
      }
      
      // Обновляем данные пользователя
      const updatedUserData = { ...users[userIndex], ...userData };
      users[userIndex] = updatedUserData;
      
      // Сохраняем обновленный список пользователей
      localStorage.setItem('users', JSON.stringify(users));
      
      // Удаляем пароль из объекта пользователя перед сохранением в состоянии
      const { password: _, ...userWithoutPassword } = updatedUserData;
      
      // Обновляем состояние и данные в localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      toast({
        title: t('profileUpdated'),
      });
      
      return true;
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      toast({
        title: t('errorOccurred'),
        description: String(error),
        variant: 'destructive',
      });
      return false;
    }
  };

  // Возвращаем контекст
  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования аутентификации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
