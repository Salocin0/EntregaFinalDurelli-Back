import mongoose from 'mongoose';
import env from '../config/enviroment.config.js';
import { selectedLogger as Logger } from '../utils/logger.js';
//mongo
import { modelProduct } from './models/db/products.model.db.js';
import { modelUsuario } from './models/db/users.model.db.js';
import { modelCart } from './models/db/carts.model.db.js';
import { ticketsModel } from './models/db/tickects.model.db.js';
//memory
import { modelProduct as productsMemory  } from './models/mem/products.model.mem.js';
import { modelUsuario as usersMemory  } from './models/mem/users.model.mem.js';
import { modelCart as cartsMemory } from './models/mem/carts.model.mem.js';
import { ticketsMemory as ticketsMemory } from './models/mem/tickects.model.mem.js';

async function importModels() {
  let models;

  switch (env.persistence) {
    case 'MONGO':
      console.log('Database: MongoDB');
      mongoose.connect(env.mongoUrl);
      models = {
        products: modelProduct,
        users: modelUsuario,
        carts: modelCart,
        tickets: ticketsModel,
      };
      break;

    case 'MEMORY':
      console.log('Database: Persistencia en memoria');
      models = {
        products: productsMemory,
        users: usersMemory,
        carts: cartsMemory,
        tickets: ticketsMemory,
      };
      break;

    default:
      throw new Error(`El tipo de persistencia "${env.persistence}" no es válido.`);
  }

  return models;
}

export default importModels;