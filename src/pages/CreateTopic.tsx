
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/use-auth';
import { useForum } from '@/hooks/use-forum';
import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { 
  Bold, Italic, Underline, 
  AlignLeft, AlignCenter, AlignRight, 
  Heading1, Heading2, Heading3
} from 'lucide-react';

const CreateTopic = () => {
  const { t, currentLanguage } = useTranslation();
  const { user, isLoggedIn } = useAuth();
  const { createTopic } = useForum();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'games' | 'industry' | 'offtopic'>('games');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title.trim()) {
      newErrors.title = currentLanguage === 'en' 
        ? 'Title is required' 
        : 'Заголовок обязателен';
    } else if (title.length < 5) {
      newErrors.title = currentLanguage === 'en' 
        ? 'Title must be at least 5 characters long' 
        : 'Заголовок должен содержать не менее 5 символов';
    }
    
    if (!content.trim()) {
      newErrors.content = currentLanguage === 'en' 
        ? 'Content is required' 
        : 'Содержание обязательно';
    } else if (content.length < 10) {
      newErrors.content = currentLanguage === 'en' 
        ? 'Content must be at least 10 characters long' 
        : 'Содержание должно содержать не менее 10 символов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const tagArray = tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const topicId = await createTopic(title, content, category, tagArray);
      
      if (topicId) {
        navigate(`/topic/${topicId}`);
      }
    } catch (error) {
      console.error('Failed to create topic:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertFormatting = (type: string) => {
    // Get the textarea element
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let formattedText = '';
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorOffset = 1;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        cursorOffset = 2;
        break;
      case 'spoiler':
        formattedText = `||${selectedText}||`;
        cursorOffset = 2;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    // Set focus back to textarea and update cursor position
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, end + cursorOffset * 2);
      } else {
        textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
      }
    }, 0);
  };
  
  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold mb-6">{t('create_new_topic')}</h1>
          
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>{t('topic_details')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">{t('title')}</label>
                  <Input 
                    id="title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={currentLanguage === 'en' ? 'Enter topic title' : 'Введите заголовок темы'} 
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">{t('category')}</label>
                  <select 
                    id="category" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as 'games' | 'industry' | 'offtopic')}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="games">{t('games')}</option>
                    <option value="industry">{t('industry')}</option>
                    <option value="offtopic">{t('offtopic')}</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">{t('content')}</label>
                  <div className="flex flex-wrap gap-1 mb-2 border border-input rounded-md px-2 py-1 bg-background">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="w-8 h-8 p-0"
                      onClick={() => insertFormatting('bold')}
                    >
                      <Bold size={16} />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="w-8 h-8 p-0"
                      onClick={() => insertFormatting('italic')}
                    >
                      <Italic size={16} />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="w-8 h-8 p-0"
                      onClick={() => insertFormatting('underline')}
                    >
                      <Underline size={16} />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="w-8 h-8 p-0"
                      onClick={() => insertFormatting('spoiler')}
                    >
                      <span className="text-xs font-bold">||S||</span>
                    </Button>
                  </div>
                  <Textarea 
                    id="content" 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={currentLanguage === 'en' ? 'Enter topic content' : 'Введите содержание темы'}
                    rows={8} 
                    className={errors.content ? 'border-destructive' : ''}
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive">{errors.content}</p>
                  )}
                  <div className="text-sm text-muted-foreground mt-2">
                    <p>
                      {currentLanguage === 'en' 
                        ? 'You can use basic formatting: **bold**, *italic*, ||spoiler||' 
                        : 'Вы можете использовать базовое форматирование: **жирный**, *курсив*, ||спойлер||'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="tags" className="text-sm font-medium">{t('tags')}</label>
                  <Input 
                    id="tags" 
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder={currentLanguage === 'en' ? 'Enter tags separated by commas' : 'Введите теги, разделенные запятыми'} 
                  />
                  <p className="text-sm text-muted-foreground">
                    {currentLanguage === 'en' 
                      ? 'Example: RPG, Strategy, News' 
                      : 'Пример: RPG, Стратегия, Новости'}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="mr-2"
                >
                  {t('cancel')}
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {currentLanguage === 'en' ? 'Creating...' : 'Создание...'}
                    </span>
                  ) : (
                    t('create_topic')
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default CreateTopic;
