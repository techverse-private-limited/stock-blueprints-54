
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

type LoginMode = 'stock' | 'biller';

interface LoginCredentials {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginMode, setLoginMode] = useState<LoginMode>('stock');
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Mock credentials
  const mockCredentials = {
    stock: {
      email: 'stock@gmail.com',
      password: 'Pass@123'
    },
    biller: {
      email: 'biller@gmail.com',
      password: 'Pass@123'
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = await login(credentials.email, credentials.password, loginMode);
    
    if (success) {
      toast.success(`Welcome ${loginMode === 'stock' ? 'Stock Manager' : 'Biller'}!`);
      
      // Redirect based on role
      if (loginMode === 'biller') {
        navigate('/biller');
      } else {
        navigate('/');
      }
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleMode = (mode: LoginMode) => {
    setLoginMode(mode);
    setCredentials({
      email: '',
      password: ''
    });
  };

  const getImageUrl = () => {
    return loginMode === 'stock' 
      ? 'https://iqhlwpnuxkxkvuuheean.supabase.co/storage/v1/object/public/assets//chef.png' 
      : 'https://iqhlwpnuxkxkvuuheean.supabase.co/storage/v1/object/public/assets//biller.png';
  };

  const getThemeClasses = () => {
    return loginMode === 'stock' ? {
      container: 'bg-gradient-to-br from-blue-50 to-blue-100',
      card: 'bg-white border-blue-200 shadow-blue-100',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      accent: 'text-blue-600',
      input: 'border-blue-200 focus:border-blue-500 focus:ring-blue-500'
    } : {
      container: 'bg-gradient-to-br from-amber-50 to-red-50',
      card: 'bg-white border-amber-200 shadow-amber-100',
      button: 'bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-800 hover:to-red-800 text-white',
      accent: 'text-amber-700',
      input: 'border-amber-200 focus:border-amber-500 focus:ring-amber-500'
    };
  };

  const theme = getThemeClasses();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Toggle Buttons - Top of page */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 lg:top-8">
        <div className="flex bg-white rounded-lg p-1 shadow-lg border">
          <button
            onClick={() => toggleMode('stock')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              loginMode === 'stock'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Stock Manager
          </button>
          <button
            onClick={() => toggleMode('biller')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              loginMode === 'biller'
                ? 'bg-gradient-to-r from-amber-700 to-red-700 text-white shadow-md'
                : 'text-gray-600 hover:text-amber-700'
            }`}
          >
            Biller Login
          </button>
        </div>
      </div>

      {/* Left Side - Image with matching background */}
      <div className={`lg:w-2/5 w-full h-64 lg:h-screen relative overflow-hidden transition-all duration-500 ${theme.container}`}>
        <div className="absolute inset-0 flex items-center justify-end pr-8">
          <img
            src={getImageUrl()}
            alt={loginMode === 'stock' ? 'Stock Manager' : 'Biller'}
            className="max-w-full max-h-full object-contain transition-all duration-500 ease-in-out"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x600/3B82F6/FFFFFF?text=Image';
            }}
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className={`lg:w-3/5 w-full min-h-screen flex items-center justify-start pl-8 lg:pl-16 p-4 lg:p-8 transition-all duration-500 ${theme.container}`}>
        <div className={`w-full max-w-md transition-all duration-500 ${theme.card} rounded-2xl p-8 shadow-xl`}>
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${theme.accent}`}>
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your {loginMode === 'stock' ? 'Stock Manager' : 'Biller'} account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`h-12 transition-all duration-200 ${theme.input}`}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`h-12 transition-all duration-200 ${theme.input}`}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full h-12 text-base font-medium transition-all duration-200 ${theme.button} shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Mock Credentials Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <p>Email: {mockCredentials[loginMode].email}</p>
            <p>Password: {mockCredentials[loginMode].password}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
