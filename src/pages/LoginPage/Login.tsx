// src/pages/LoginPage.tsx
import React, { useEffect } from 'react';
import LoginForm from '../../components/Login/LoginForm';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useLogin } from '../../queries/user.query';
import UserService from '../../services/user.service';

export default function Login() {
  const navigate = useNavigate();
  const { mutate: login, isPending: isLoading, error } = useLogin();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (UserService.isLoggedIn()) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (values: { username: string; password: string }) => {
    login(values, {
      onSuccess: () => {
        navigate(ROUTES.DASHBOARD, { replace: true });
      },
      onError: (error) => {
        console.error('Login failed:', error);
      },
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-red-600 text-center mb-6">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Please enter your credentials to log in.
        </p>

        <LoginForm
          onSubmit={handleLogin}
          loading={isLoading}
          error={error?.message}
        />
      </div>
    </div>
  );
}
