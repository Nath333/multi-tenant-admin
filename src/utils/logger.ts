/**
 * Development-only logger utility
 *
 * Wraps console methods to only output in development mode.
 * In production builds, these become no-ops for better performance.
 */

const isDev = import.meta.env.DEV;

type LogArgs = unknown[];

export const logger = {
  log: (...args: LogArgs): void => {
    if (isDev) {
      console.log(...args);
    }
  },

  warn: (...args: LogArgs): void => {
    if (isDev) {
      console.warn(...args);
    }
  },

  error: (...args: LogArgs): void => {
    // Always log errors, but could be sent to error tracking service in production
    console.error(...args);
  },

  debug: (...args: LogArgs): void => {
    if (isDev) {
      console.debug(...args);
    }
  },

  info: (...args: LogArgs): void => {
    if (isDev) {
      console.info(...args);
    }
  },

  /**
   * Log a message only in development, with optional label
   */
  dev: (label: string, ...args: LogArgs): void => {
    if (isDev) {
      console.log(`[${label}]`, ...args);
    }
  },

  /**
   * Performance timing utility - only works in development
   */
  time: (label: string): void => {
    if (isDev) {
      console.time(label);
    }
  },

  timeEnd: (label: string): void => {
    if (isDev) {
      console.timeEnd(label);
    }
  },

  /**
   * Group console output - only in development
   */
  group: (label: string): void => {
    if (isDev) {
      console.group(label);
    }
  },

  groupEnd: (): void => {
    if (isDev) {
      console.groupEnd();
    }
  },
} as const;

export default logger;
