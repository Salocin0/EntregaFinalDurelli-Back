import express from 'express';
import { userController } from '../controllers/users.controller.js';
import { uploader } from '../utils/multer.js';
import { checkAdmin } from '../middlewares/auth.js';

export const routerUsers = express.Router();

routerUsers.post('/:uid/documents',uploader.array('documents',12), userController.documents);

routerUsers.get('/',checkAdmin, userController.getAll);

routerUsers.get('/premium/:uid', userController.changerol);

routerUsers.get('/:id', userController.getOne);

routerUsers.post('/', userController.create);

routerUsers.put('/:id', userController.update);

routerUsers.delete('/',checkAdmin, userController.delete);
routerUsers.delete('/:id',checkAdmin, userController.deleteOne);



