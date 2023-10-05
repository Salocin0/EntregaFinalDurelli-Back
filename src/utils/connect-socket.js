import { Server } from 'socket.io';
import { MsgModel } from '../DAO/models/mongoose/msgs.model.js';
import { ProductsModel } from '../DAO/models/mongoose/products.model.js';
import { selectedLogger as logger } from './logger.js';

export function connectSocketServer(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on('connection', async (socket) => {
    try {
      const allProducts = await ProductsModel.find({});
      socket.emit('products', allProducts);
    } catch (e) {
      logger.error(e);
    }

    socket.on('new-product', async (newProd) => {
      try {
        await ProductsModel.create(newProd);
        const prods = await ProductsModel.find({});
        socketServer.emit('products', prods);
      } catch (e) {
        logger.error(e);
      }
    });

    socket.on('productModified', async (id, newProd) => {
      try {
        await ProductsModel.findOneAndUpdate({ _id: id }, newProd);
        const prod = await ProductsModel.find({});
        socketServer.emit('products', prod);
      } catch (e) {
        logger.error(e);
      }
    });

    socket.on('delete-product', async (idProd) => {
      try {
        await ProductsModel.deleteOne({ _id: idProd });
        const prods = await ProductsModel.find({});
        socketServer.emit('products', prods);
      } catch (e) {
        logger.error(e);
      }
    });

    socket.on('msg_front_to_back', async (msg) => {
      try {
        await MsgModel.create(msg);
      } catch (e) {
        logger.error(e);
      }
      try {
        const msgs = await MsgModel.find({});
        socketServer.emit('listado_de_msgs', msgs);
      } catch (e) {
        logger.error(e);
      }
    });
  });
}
