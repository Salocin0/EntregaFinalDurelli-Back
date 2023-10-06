class LoggerService {
  async test() {
    selectedLogger.debug('debug');
    selectedLogger.http('http');
    selectedLogger.info('info');
    selectedLogger.warn('warn');
    selectedLogger.error('error');
    return res.status(200).json({
      status: 'success',
      msg: 'all logs',
    });
  }
}

export const loggerService = new LoggerService();
