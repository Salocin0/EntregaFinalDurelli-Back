import express from 'express';
export const testChatRouter = express.Router();
import { checkUser } from '../middlewares/auth.js';

testChatRouter.get('/', (req, res) => {
  return res.status(200).render('test-chat', {});
});
