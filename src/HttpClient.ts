import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import { SwiftsmsException } from './SwiftsmsException';

export interface HttpClientOptions {
  autoRetry?: boolean;
  maxRetries?: number;
  baseDelayMs?: number;
  timeout?: number;
}

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private autoRetry: boolean;
  private maxRetries: number;
  private baseDelayMs: number;
  
  public lastRequest?: any;
  public lastResponse?: any;

  constructor(apiToken: string, options: HttpClientOptions = {}) {
    this.autoRetry = options.autoRetry ?? false;
    this.maxRetries = options.maxRetries ?? 3;
    this.baseDelayMs = options.baseDelayMs ?? 100;

    this.axiosInstance = axios.create({
      baseURL: 'https://swiftsmsgh.com/api/v3',
      timeout: options.timeout ?? 20000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
    });

    // Interceptors to capture last request and response
    this.axiosInstance.interceptors.request.use((config) => {
      this.lastRequest = config;
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.lastResponse = response;
        return response;
      },
      (error) => {
        this.lastResponse = error.response;
        return Promise.reject(error);
      }
    );
  }

  public async request<T = any>(method: Method, url: string, data?: any): Promise<T> {
    let attempt = 0;
    let lastError: any = null;

    // Use at least 1 attempt if autoRetry is disabled, otherwise use maxRetries
    const totalAttempts = this.autoRetry ? this.maxRetries : 1;

    while (attempt < totalAttempts) {
      try {
        const config: AxiosRequestConfig = { method, url };
        if (data && ['post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
          config.data = data;
        }

        const response = await this.axiosInstance.request(config);
        
        // Handle custom application-level errors if any
        if (response.data && response.data.status === 'error') {
            throw new SwiftsmsException(
                response.data.message || 'API Error',
                response.data.code,
                response.status
            );
        }
        
        return response.data;
      } catch (error: any) {
        lastError = error;

        // If it's our own exception, just throw it (client logic error from API)
        if (error instanceof SwiftsmsException) {
          throw error;
        }

        // Axios error handling
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || error.message;
          const code = error.response.data?.code;
          
          // Don't retry on client errors (4xx) except 429 if we want
          if (status >= 400 && status < 500 && status !== 429) {
            throw new SwiftsmsException(message, code, status);
          }

          if (attempt >= totalAttempts - 1) {
             throw new SwiftsmsException(message, code, status);
          }
        } else {
          // Network error (no response)
          if (attempt >= totalAttempts - 1) {
            throw new SwiftsmsException(error.message || 'Network error');
          }
        }

        attempt++;
        await this.sleep(attempt);
      }
    }

    throw lastError;
  }

  private sleep(attempt: number): Promise<void> {
    const delayMs = this.baseDelayMs * Math.pow(2, attempt - 1);
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
