
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/use-auth';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const EditProfile = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    navigate('/login');
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (avatar && !isValidUrl(avatar)) {
      newErrors.avatar = currentLanguage === 'en' 
        ? 'Please enter a valid URL'
        : 'Пожалуйста, введите корректный URL';
    }

    if (bio && bio.length > 500) {
      newErrors.bio = currentLanguage === 'en'
        ? 'Bio must not exceed 500 characters'
        : 'Описание не должно превышать 500 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const success = await updateProfile({
        avatar,
        bio,
      });

      if (success) {
        navigate('/profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-2xl mx-auto"
      >
        <button
          onClick={() => navigate('/profile')}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('profile')}
        </button>

        <div className="card">
          <h1 className="text-2xl font-bold mb-6">{t('editProfile')}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Аватар */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('avatar')}
              </label>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={user.username}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.username}&size=64`;
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-semibold text-primary">
                        {user.username[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="form-input w-full"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {errors.avatar && (
                    <p className="mt-1 text-sm text-destructive">{errors.avatar}</p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">
                    {currentLanguage === 'en'
                      ? 'Enter the URL of your avatar image'
                      : 'Введите URL вашего изображения аватара'}
                  </p>
                </div>
              </div>
            </div>

            {/* Описание */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('bio')}
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="form-input w-full resize-none"
                placeholder={currentLanguage === 'en'
                  ? 'Write something about yourself...'
                  : 'Напишите что-нибудь о себе...'}
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-destructive">{errors.bio}</p>
              )}
              <p className="mt-1 text-sm text-muted-foreground">
                {bio.length}/500
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="button-secondary px-6 py-2"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="button-primary px-6 py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('save')}...
                  </span>
                ) : (
                  t('save')
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfile;
