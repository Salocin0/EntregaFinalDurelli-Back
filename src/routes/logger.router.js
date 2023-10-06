import express from 'express';
import { loggerService } from '../services/logger.service.js';
export const loggerRouter = express.Router();

loggerRouter.get('/', loggerService.test);

