
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/use-auth';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!username.trim()) {
      newErrors.username = t('required');
    }
    
    if (!email.trim()) {
      newErrors.email = t('required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('invalidEmail');
    }
    
    if (!password) {
      newErrors.password = t('required');
    } else if (password.length < 6) {
      newErrors.password = t('passwordTooShort');
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = t('passwordsDontMatch');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await register(username, email, password);
      
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">
          {t('register')}
        </h2>
        
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                {t('username')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input w-full"
                placeholder={t('username')}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-destructive">{errors.username}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input w-full"
                placeholder={t('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input w-full pr-10"
                  placeholder={t('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                {t('confirmPassword')}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input w-full pr-10"
                  placeholder={t('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="button-primary w-full py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('register')}...
                </span>
              ) : (
                t('registerNow')
              )}
            </button>
            
            <p className="text-center mt-4 text-sm text-muted-foreground">
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-primary hover:underline">
                {t('login')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
