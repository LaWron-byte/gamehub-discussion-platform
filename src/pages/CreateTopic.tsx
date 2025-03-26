
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from '@/hooks/use-translation';

const CreateTopic = () => {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">{t('create_new_topic')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('topic_details')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">{t('title')}</label>
            <Input id="title" placeholder={t('enter_topic_title')} />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">{t('category')}</label>
            <select 
              id="category" 
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="games">{t('games')}</option>
              <option value="industry">{t('industry')}</option>
              <option value="offtopic">{t('offtopic')}</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">{t('content')}</label>
            <Textarea 
              id="content" 
              placeholder={t('enter_topic_content')}
              rows={8} 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">{t('tags')}</label>
            <Input id="tags" placeholder={t('enter_tags_separated_by_commas')} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">{t('create_topic')}</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateTopic;
