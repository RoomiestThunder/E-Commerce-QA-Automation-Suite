/**
 * Logger utility for test debugging and reporting
 */

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private logLevel: LogLevel = LogLevel.INFO;

  constructor() {
    const level = process.env.LOG_LEVEL?.toUpperCase() || 'INFO';
    this.logLevel = LogLevel[level as keyof typeof LogLevel] || LogLevel.INFO;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  debug(message: string) {
    if (this.logLevel === LogLevel.DEBUG) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message));
    }
  }

  info(message: string) {
    console.log(this.formatMessage(LogLevel.INFO, message));
  }

  warn(message: string) {
    console.warn(this.formatMessage(LogLevel.WARN, message));
  }

  error(message: string, error?: Error) {
    console.error(this.formatMessage(LogLevel.ERROR, message));
    if (error) {
      console.error(error);
    }
  }
}

export const logger = new Logger();
