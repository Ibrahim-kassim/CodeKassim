import api from "../AppServices/initApi";
import { useGenericEditHook } from "../hooks/useGenericEditHook";
import { AxiosResponse } from "axios";
import { ENTITIES } from "../models/entities";
import UserService from "../services/user.service";

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  _id: string;
  username: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  token: string;
}

// Login user
export function useLogin() {
  const mutation = useGenericEditHook<LoginCredentials, LoginResponse>(
    async (credentials) => {
      const response: AxiosResponse<LoginResponse> = await api.post('users/login', credentials);
      
      if (response?.data?.token) {
        UserService.setUser(response.data);
      }
      
      return response.data;
    },
    ENTITIES.USERS,
    {
      successMessage: 'Login successful',
      errorMessage: 'Invalid email or password'
    }
  );

  return {
    ...mutation,
    isPending: mutation.isPending
  };
}

// Logout user
export function useLogout() {
  const mutation = useGenericEditHook<void, void>(
    async () => {
      UserService.doLogout();
      return Promise.resolve();
    },
    ENTITIES.USERS,
    {
      successMessage: 'Logged out successfully'
    }
  );

  return {
    ...mutation,
    isPending: mutation.isPending
  };
}

// Helper functions
export const isAuthenticated = () => {
  return UserService.isLoggedIn();
};

export const getUser = () => {
  const user = UserService.getUser();
  return {
    email: user?.email,
    username: user?.username,
    isAdmin: user?.isAdmin
  };
};

export const getToken = () => {
  return UserService.getToken();
};
