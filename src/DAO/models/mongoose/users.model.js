import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const documentSchema = new Schema({
  name: { type: String, required: true },
  reference: { type: String, required: true },
});

const schema = new Schema({
  email: { type: String, required: true, max: 100 },
  password: { type: String, required: false, max: 100 },
  firstName: { type: String, required: false, max: 100 },
  lastName: { type: String, required: false, max: 100 },
  age: { type: Number, required: false },
  cart: { type: String, required: false },
  rol: { type: String, default: 'user', required: true },
  lastconnection: { type: Date },
  documents: [documentSchema],
});

schema.plugin(mongoosePaginate);

export const UserModel = model('User', schema);
