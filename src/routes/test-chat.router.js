import express from 'express';
export const testChatRouter = express.Router();
import { isUserNotAdmin } from '../middlewares/auth.js';

testChatRouter.get('/',isUserNotAdmin, (req, res) => {
  return res.status(200).render('test-chat', {});
});
