import { selectedLogger } from './../utils/logger.js';

class LoggerService {
  async test() {
    selectedLogger.debug('debug');
    selectedLogger.http('http');
    selectedLogger.info('info');
    selectedLogger.warn('warn');
    selectedLogger.error('error');
    return true;
  }
}

export const loggerService = new LoggerService();
