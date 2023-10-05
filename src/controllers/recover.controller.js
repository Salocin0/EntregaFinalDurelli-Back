import { recoverService } from '../services/Recover.service.js';
class RecoverControler {
  async recoverPassPost(req, res) {
    let { token, email, password } = req.body;
    const updatedUser = await recoverService.recoverpassPost(token, email, password);
    if (updatedUser) {
      res.redirect('/');
    } else {
      res.render('error', { errorMsg: 'token expiro o token invalido' });
    }
  }

  async recoverPassGet(req, res) {
    const { token, email } = req.query;
    const recover = await recoverService.recoverpassGet(token, email);
    if (recover) {
      res.render('recover-pass', { token, email });
    } else {
      res.render('error', { errorMsg: 'token expiro o token invalido' });
    }
  }

  async recoverEmail(req, res) {
    const { email } = req.body;
    const recover = await recoverService.recoverEmail(email);
    res.render('error', { checkEmail: 'Check your email' });
  }
}

export const recoverControler = new RecoverControler();
