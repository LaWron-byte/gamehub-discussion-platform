
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from '@/hooks/use-translation';

const TopicView = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{t('topic')} #{id}</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('topic_title')} #{id}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {t('by')} User123 • {new Date().toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent>
          <p>{t('topic_content_placeholder')}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {t('likes')}: 0
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t('comments')}</h2>
        <p className="text-muted-foreground">{t('no_comments_yet')}</p>
      </div>
    </div>
  );
};

export default TopicView;
