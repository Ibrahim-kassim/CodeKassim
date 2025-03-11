/* eslint-disable */
import Api from './api.init';
import UserService from './user.service';
import { AxiosError, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

async function requestHandler(request: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  return UserService.updateToken(() => {
    const headers = new AxiosHeaders(request.headers);
    const token = UserService.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return Promise.resolve({
      ...request,
      headers
    });
  }) as Promise<InternalAxiosRequestConfig>;
}

function responseErrorHandler(error: AxiosError) {
  if (error.response?.status === 401) {
    UserService.doLogin();
  }
  return Promise.reject(error);
}

export function initializeAPI() {
  Api.init({
    baseURL: import.meta.env.VITE_BACK_END_URL,
    interceptors: {
      request: requestHandler,
      response: {
        onRejected: responseErrorHandler,
      },
    },
  });
}

// Add more API initializations as needed
export function initializeAPIV2() {
  Api.init({
    baseURL: import.meta.env.VITE_BACK_END_URL,
    interceptors: {
      request: requestHandler,
      response: {
        onRejected: responseErrorHandler,
      },
    },
  });
}
