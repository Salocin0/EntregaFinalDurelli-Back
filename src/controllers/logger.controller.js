import EErrors from '../services/errors/enums.js';
import CustomError from '../services/errors/custom-error.js';
import { loggerService } from '../services/logger.service.js';

class LoggerController {
  async test(req, res) {
    try {
      const logger = await loggerService.test();
      if (logger) {
        return res.status(200).json({
          status: 'success',
          msg: 'all logs',
        });
      }
    } catch (e) {
      CustomError.createError({
        name: 'Error Del Servidor',
        cause: 'Ocurrió un error inesperado en el servidor. La operación no pudo completarse.',
        message: 'Lo sentimos, ha ocurrido un error inesperado en el servidor. Por favor, contacta al equipo de soporte.',
        code: EErrors.SERVER_ERROR,
      });
    }
  }
}

export const loggerController = new LoggerController();
