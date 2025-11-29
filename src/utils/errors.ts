/**
 * Error Utilities - Minimal version
 * Only includes errors actually used by the application
 */

export class AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class NetworkError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'NETWORK_ERROR', 0, details);
  }
}

export class TimeoutError extends AppError {
  constructor(_message: string, timeout: number) {
    super(`Request timed out after ${timeout}ms`, 'TIMEOUT_ERROR', 408, { timeout });
  }
}

export function createErrorFromStatus(status: number, message: string): AppError {
  return new AppError(message, `HTTP_${status}`, status);
}

export function logError(error: Error | AppError, context?: Record<string, unknown>): void {
  console.error('[Error]', error.message, context || {});
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxAttempts) break;

      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}
