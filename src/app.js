import { routerVistaRealTimeProducts } from './routes/realTimeProducts.vista.router.js';
import { routerVistaProductos } from './routes/productos.vista.router.js';
import { routerVistaProducts } from './routes/products.vista.router.js';
import { recoverControler } from './controllers/recover.controller.js';
import { routerVistaUsers } from './routes/users.vista.router.js';
import { routerVistaCart } from './routes/cart.vista.router.js';
import { connectSocketServer } from './utils/connect-socket.js';
import { testChatRouter } from './routes/test-chat.router.js';
import { routerProductos } from './routes/products.router.js';
import enviromentConfig from './config/enviroment.config.js';
import { iniPassport } from './config/passport.config.js';
import { loggerRouter } from './routes/logger.router.js';
import { routerUsers } from './routes/users.router.js';
import { viewsRouter } from './routes/views.router.js';
import { loginRouter } from './routes/login.router.js';
import { routerCarts } from './routes/cart.router.js';
import { connectMongo } from './utils/connections.js';
import { selectedLogger } from './utils/logger.js';
import errorHandler from './middlewares/error.js';
import compression from 'express-compression';
import { addLogger } from './utils/logger.js';
import handlebars from 'express-handlebars';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from "swagger-jsdoc";
import cookieParser from 'cookie-parser';
import { __dirname } from './dirname.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import { Server } from 'socket.io';
import passport from 'passport';
import express from 'express';
import cors from "cors";

connectMongo();
//configuraciones
const app = express();
const PORT = enviromentConfig.port;
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion API",
      description: "Este proyecto es un ecommerce",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
const specs = swaggerJSDoc(swaggerOptions);

//funciones de inicio

iniPassport();

//middlewares
app.use(cors());
app.use(addLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://Salocin0:bQJ5b9byQb6PlLWM@coder.qmxekir.mongodb.net/?retryWrites=true&w=majority', ttl: 86400 * 7 }),
    secret: 'coder-secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(compression({ brotli: { enable: true, zlib: {} } }));
app.use(
  session({
    secret: 'coder-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: enviromentConfig.mongoUrl,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 3600,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
//endpoints
  //api
app.use('/api/products', routerProductos);
app.use('/api/sessions', loginRouter);
app.use('/api/loggerTest', loggerRouter);
app.use('/api/carts', routerCarts);
app.use('/api/users', routerUsers);
  //vista
app.use('/vista/realtimeproducts', routerVistaRealTimeProducts);
app.use("/apidocs", swaggerUi.serve, swaggerUi.setup(specs));
app.post('/recover-pass', recoverControler.recoverPassPost);
app.get('/recover-pass', recoverControler.recoverPassGet);
app.post('/recover-mail', recoverControler.recoverEmail);
app.get('/error-autentificacion', (req, res) => {
  return res.status(400).render('error-page', { msg: 'error al loguear' });
});
app.use('/vista/products', routerVistaProducts);
app.use('/vista/users', routerVistaUsers);
app.use('/vista/cart', routerVistaCart);
app.get('/recover-mail', (_, res) => {
  res.render('recover-mail');
});
app.use('/test-chat', testChatRouter);
app.use('/', viewsRouter);
  //generica
app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'Error',
    msg: 'page not found',
    data: {},
  });
});
//inicializacion de los servidores
const httpServer = app.listen(PORT, () => {
  console.log(`Levantando en puerto http://localhost:${PORT}`);
});
connectSocketServer(httpServer);

//handle de errores
app.use(errorHandler);