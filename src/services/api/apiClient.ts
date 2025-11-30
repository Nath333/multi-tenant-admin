/**
 * API Client - Professional Axios wrapper with retry logic and circuit breaker
 * Provides robust error handling, request retries, and automatic failover
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse } from '../../types';

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

// ============================================================================
// Circuit Breaker Implementation
// ============================================================================

class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private readonly failureThreshold: number;
  private readonly resetTimeout: number;

  constructor(
    failureThreshold: number = 5,
    resetTimeout: number = 60000 // 1 minute
  ) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (
        this.lastFailureTime &&
        Date.now() - this.lastFailureTime > this.resetTimeout
      ) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN - service unavailable');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getState(): string {
    return this.state;
  }
}

const circuitBreaker = new CircuitBreaker();

// ============================================================================
// Axios Instance
// ============================================================================

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add auth token, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        const token = state?.user?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }

    // Add tenant context if available
    const tenantId = localStorage.getItem('current-tenant-id');
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// Response Interceptor - Professional Error Handling
// ============================================================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      // Handle 401 - redirect to login
      if (status === 401) {
        localStorage.removeItem('auth-storage');
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
    }

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('API Error:', error);
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// Request Wrapper with Retry and Circuit Breaker
// ============================================================================

export interface RequestOptions extends AxiosRequestConfig {
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  useCircuitBreaker?: boolean;
}

/**
 * Professional request wrapper with retry logic and circuit breaker
 */
export async function request<T>(
  config: RequestOptions
): Promise<ApiResponse<T>> {
  const {
    enableRetry = true,
    maxRetries = MAX_RETRIES,
    retryDelay = INITIAL_RETRY_DELAY,
    useCircuitBreaker = true,
    ...axiosConfig
  } = config;

  const makeRequest = async (): Promise<T> => {
    const response = await apiClient.request<T>(axiosConfig);
    return response.data;
  };

  const retryRequest = async (): Promise<T> => {
    let lastError: unknown;
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await makeRequest();
      } catch (error) {
        lastError = error;
        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, i)));
        }
      }
    }
    throw lastError;
  };

  try {
    let result: T;

    if (useCircuitBreaker) {
      result = await circuitBreaker.execute(async () => {
        return enableRetry ? await retryRequest() : await makeRequest();
      });
    } else {
      result = enableRetry ? await retryRequest() : await makeRequest();
    }

    return {
      success: true,
      data: result,
      message: 'Request successful',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Request failed';
    return {
      success: false,
      error: errorMessage,
      message: 'Request failed',
    };
  }
}

// ============================================================================
// Convenience API Methods
// ============================================================================

export const api = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>({ ...options, method: 'GET', url }),

  post: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>({ ...options, method: 'POST', url, data }),

  put: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>({ ...options, method: 'PUT', url, data }),

  patch: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>({ ...options, method: 'PATCH', url, data }),

  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>({ ...options, method: 'DELETE', url }),
};

/**
 * Get circuit breaker status for monitoring
 */
export function getCircuitBreakerStatus(): {
  state: string;
} {
  return {
    state: circuitBreaker.getState(),
  };
}

export default apiClient;
