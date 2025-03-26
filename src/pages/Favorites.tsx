
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from '@/hooks/use-translation';

const Favorites = () => {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{t('favorites')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('your_favorite_topics')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('no_favorites_yet')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Favorites;
