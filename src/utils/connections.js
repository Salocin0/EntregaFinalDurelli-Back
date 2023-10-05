import { connect } from 'mongoose';
import env from '../config/enviroment.config.js';
export async function connectMongo() {
  try {
    await connect(env.mongoUrl);
    console.log('Conexión exitosa mongo.');
  } catch (e) {
    console.log('Falló la conexión a mongo.');
    throw 'Falló la conexion';
  }
}