
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from '@/hooks/use-translation';

const ForumCategory = () => {
  const { category } = useParams();
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{category}</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('category_description')}</CardTitle>
          <CardDescription>
            {t('forum_category_description', { category })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('no_topics_yet')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumCategory;
