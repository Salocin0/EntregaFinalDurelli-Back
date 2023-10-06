import express from 'express';
import { loggerController } from '../controllers/logger.controller.js';
export const loggerRouter = express.Router();

loggerRouter.get('/', loggerController.test);

