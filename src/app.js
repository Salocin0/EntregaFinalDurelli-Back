import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import express from 'express';
import handlebars from 'express-handlebars';
import { routerCarts } from './routes/cart.router.js';
import { routerProductos } from './routes/products.router.js';
import { routerVistaProductos } from './routes/productos.vista.router.js';
import { routerVistaRealTimeProducts } from './routes/realTimeProducts.vista.router.js';
import { routerUsers } from './routes/users.router.js';
import { __dirname } from './dirname.js';
import { Server } from 'socket.io';
import { connectMongo } from './utils/connections.js';
import { routerVistaProducts } from './routes/products.vista.router.js';
import { routerVistaCart } from './routes/cart.vista.router.js';
import { viewsRouter } from './routes/views.router.js';
import { loginRouter } from './routes/login.router.js';
import passport from 'passport';
import { iniPassport } from './config/passport.config.js';
import errorHandler from './middlewares/error.js';
import compression from 'express-compression';
import { addLogger } from './utils/logger.js';
import { selectedLogger } from './utils/logger.js';
import { connectSocketServer } from './utils/connect-socket.js';
import enviromentConfig from './config/enviroment.config.js';
import { testChatRouter } from './routes/test-chat.router.js';
import { recoverControler } from './controllers/recover.controller.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from "swagger-jsdoc";

const app = express();
app.use(addLogger);
const PORT = enviromentConfig.port;

connectMongo();

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
app.use("/apidocs", swaggerUi.serve, swaggerUi.setup(specs));

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

iniPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/api/products', routerProductos);
app.use('/api/carts', routerCarts);
app.use('/test-chat', testChatRouter);
//app.use("/vista/products", routerVistaProductos);
app.use('/vista/realtimeproducts', routerVistaRealTimeProducts);
app.use('/vista/cart', routerVistaCart);
app.use('/api/users', routerUsers);
app.use('/vista/products', routerVistaProducts);
app.use('/', viewsRouter);
app.use('/api/sessions', loginRouter);
app.get('/api/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/loggerTest', (req, res) => {
  selectedLogger.debug('debug');
  selectedLogger.http('http');
  selectedLogger.info('info');
  selectedLogger.warn('warn');
  selectedLogger.error('error');
  return res.status(200).json({
    status: 'success',
    msg: 'all logs',
  });
});

app.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/error-autentificacion' }), (req, res) => {
  req.session.firstName = req.user.firstName;
  req.session.email = req.user.email;
  res.clearCookie('userId');
  res.cookie('userId', req.user._id, { maxAge: 3600000 });
  res.redirect('/vista/products');
});
app.get('/error-autentificacion', (req, res) => {
  return res.status(400).render('error-page', { msg: 'error al loguear' });
});


const httpServer = app.listen(PORT, () => {
  console.log(`Levantando en puerto http://localhost:${PORT}`);
});

connectSocketServer(httpServer);
app.use(
  session({
    secret: 'jhasdkjh671246JHDAhjd',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: enviromentConfig.mongoUrl,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 3600,
    }),
  })
);

app.get('/recover-mail', (_, res) => {
  res.render('recover-mail');
});

app.post('/recover-pass', recoverControler.recoverPassPost);

app.get('/recover-pass', recoverControler.recoverPassGet);

app.post('/recover-mail', recoverControler.recoverEmail);

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'Error',
    msg: 'page not found',
    data: {},
  });
});

app.use(errorHandler);