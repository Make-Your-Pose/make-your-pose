/**
 * Logger utility that only outputs in development environment
 * Suppresses all logs in production
 */
export const logger = {
  /**
   * Regular log message (only in development)
   */
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args);
    }
  },

  /**
   * Warning log message (only in development)
   */
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(...args);
    }
  },

  /**
   * Error log message (only in development)
   */
  error: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(...args);
    }
  },
};

/**
 * Default logger function for simple logging
 * @param args Arguments to log
 */
export default function log(...args: unknown[]) {
  logger.log(...args);
}
