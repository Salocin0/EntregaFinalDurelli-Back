import { RecoverTokensMongoose } from '../DAO/models/mongoose/recover-codes.js';
import { UserModel } from '../DAO/models/mongoose/users.model.js';
import { createHash,isValidPassword } from '../utils/bcrypt.js';
import { randomBytes } from 'crypto';
import transport from '../utils/nodemailer.js';
import enviromentConfig from '../config/enviroment.config.js';

class RecoverService {
  async getRecoverToken(token, email) {
    const foundToken = await RecoverTokensMongoose.findOne({ token, email });
    return foundToken;
  }

  async recoverpassPost(token, email, password) {
    const foundToken = await this.getRecoverToken(token, email);
    if (foundToken && foundToken.expire > Date.now() && password) {
      const User = await UserModel.findOne({ email }, { password });
      if(isValidPassword(password,User.password)){
        throw new Error('password is the same');
      }else{
        password = createHash(password);
        const updatedUser = await UserModel.updateOne({ email }, { password });
        return updatedUser;
      }
    } else {
      return null;
    }
  }

  async recoverpassGet(token, email) {
    const foundToken = await this.getRecoverToken(token, email);
    if (foundToken && foundToken.expire > Date.now()) {
      return true;
    } else {
      return false;
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  async recoverEmail(email) {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error('Invalid email');
    }
    const token = randomBytes(20).toString('hex');
    const expire = Date.now() + 3600000;
    const tokenSaved = await RecoverTokensMongoose.create({
      email,
      token,
      expire,
    });

    const result = await transport.sendMail({
      from: enviromentConfig.googleEmail,
      to: email,
      subject: 'RECUPERACION',
      html: `
              <div>
                  <p>Tu codigo para cambiar pass es ${token}</p>
                  <a href="${enviromentConfig.apiUrl}/recover-pass?token=${token}&email=${email}">cambiar?</a>				
              </div>
              `,
    });
  }
}

export const recoverService = new RecoverService();
