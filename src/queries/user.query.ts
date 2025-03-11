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
  token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Login user
export function useLogin() {
  const mutation = useGenericEditHook<LoginCredentials, LoginResponse>(
    async (credentials) => {
      // First authenticate with backend
      const response: AxiosResponse<LoginResponse> = await api.post('users/login', credentials);
      
      // Then initialize Keycloak session
      if (response?.data?.token) {
        await UserService.initKeycloak({
          realm: process.env.REACT_APP_KEYCLOAK_REALM || '',
          url: process.env.REACT_APP_KEYCLOAK_URL || '',
          clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || '',
          onAuthenticatedCallback: () => {
            // Token is now managed by Keycloak and available for React Query
            console.log('Keycloak session initialized');
          }
        });
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
      // Let Keycloak handle the logout
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
  return {
    email: UserService.getEmail(),
    name: UserService.getUsername(),
    roles: UserService.getCustomRoles()
  };
};

export const getToken = () => {
  return UserService.getToken();
};
