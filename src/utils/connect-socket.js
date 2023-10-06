import { Server } from 'socket.io';
import { MsgModel } from '../DAO/models/mongoose/msgs.model.js';
import CustomError from '../services/errors/custom-error.js';
import EErrors from '../services/errors/enums.js';
import { productService } from './../services/products.service.js';

export function connectSocketServer(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on('connection', (socket) => {
    socket.on('msg_front_to_back', async (msg) => {
      const msgCreated = await MsgModel.create(msg);
      const msgs = await MsgModel.find({});
      socketServer.emit('msg_back_to_front', msgs);
    });
  });

  socketServer.on('connection', (socket) => {
    socket.on('new-product-created', async (newProduct) => {
      try {
        await productService.createProduct(
          newProduct.title,
          newProduct.description,
          newProduct.code,
          newProduct.price,
          newProduct.status,
          newProduct.stock,
          newProduct.category,
          newProduct.owner
        );
        let allProducts = await productService.getAllProducts(30, 1);
        console.log(allProducts)
        socketServer.emit('all-the-products', allProducts);
      } catch (error) {
        console.log(error, 'error');
        CustomError.createError({
          name: 'Error De Conexion por Socket',
          cause: 'No se pudo establecer una conexión con Socket',
          message: 'Ocurrió un error al intentar conectarse con Socket.',
          code: EErrors.SOCKET_CONNECTION_ERROR,
        });
      }
    });

    socket.on('all-products', async () => {
      try {

        let allProducts = await productService.getAllProducts(30, 1);
        socketServer.emit('all-the-products', allProducts);
      } catch (error) {
        console.log(error, 'error');
        CustomError.createError({
          name: 'Error De Conexion por Socket',
          cause: 'No se pudo establecer una conexión con Socket',
          message: 'Ocurrió un error al intentar conectarse con Socket.',
          code: EErrors.SOCKET_CONNECTION_ERROR,
        });
      }
    });
    socket.on('delete-product', async (id) => {
      try {
        await productService.deleteProduct(id);
        let allProducts = await productService.getAllProducts(30, 1);
        socketServer.emit('all-the-products', allProducts);
      } catch (error) {
        console.log(error, 'error');
        CustomError.createError({
          name: 'Error De Conexion por Socket',
          cause: 'No se pudo establecer una conexión con Socket',
          message: 'Ocurrió un error al intentar conectarse con Socket.',
          code: EErrors.SOCKET_CONNECTION_ERROR,
        });
      }
    });
  });
}
