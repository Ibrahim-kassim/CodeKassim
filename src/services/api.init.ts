import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface ApiConfig {
  baseURL: string;
  interceptors?: {
    request?: (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig>;
    response?: {
      onRejected: (error: AxiosError) => Promise<never>;
    };
  };
}

class Api {
  private static instance = axios.create();
  private static baseURL: string;

  static init(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.instance = axios.create({
      baseURL: config.baseURL
    });

    if (config.interceptors) {
      if (config.interceptors.request) {
        this.instance.interceptors.request.use(config.interceptors.request);
      }
      if (config.interceptors.response) {
        this.instance.interceptors.response.use(
          (response) => response,
          config.interceptors.response.onRejected
        );
      }
    }
  }

  static getInstance() {
    return this.instance;
  }

  static getBaseURL() {
    return this.baseURL;
  }
}

export default Api;
