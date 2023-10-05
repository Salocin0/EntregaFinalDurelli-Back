import express from 'express';
import { isAmdin, checkPremiumAdmin, checkPremium } from '../middlewares/auth.js';
import { productControler } from '../controllers/products.controller.js';
export const routerProductos = express.Router();

routerProductos.get('/', productControler.getAll);

routerProductos.get('/mockingproducts', productControler.getProductsByMock);

routerProductos.get('/:id', productControler.getOne);

routerProductos.delete('/:id', checkPremiumAdmin, productControler.delete);

routerProductos.put('/:id', checkPremiumAdmin, productControler.update);

routerProductos.post('/', checkPremiumAdmin, productControler.create);
