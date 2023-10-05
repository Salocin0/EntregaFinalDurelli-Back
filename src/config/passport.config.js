import fetch from 'node-fetch';
import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { UserModel } from '../DAO/models/mongoose/users.model.js';
import GitHubStrategy from 'passport-github2';
const LocalStrategy = local.Strategy;
import { selectedLogger } from '../utils/logger.js';

export function iniPassport() {
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: 'Iv1.32eaf723d820cff8',
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
      },

      async (accesToken, _, profile, done) => {
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);
          if (!emailDetail) {
            selectedLogger.error('cannot get a valid email for this user');
            return done(new Error('cannot get a valid email for this user'));
          }
          profile.email = emailDetail.email;
          let user = await UserModel.findOne({ email: profile.email });
          if (!user) {
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              password: 'nopass',
              rol: 'Usuario',
            };
            let userCreated = await UserModel.create(newUser);
            selectedLogger.info('User Registration succesful');
            return done(null, userCreated);
          } else {
            selectedLogger.info('User already exists');
            return done(null, user);
          }
        } catch (e) {
          selectedLogger.error('Error in register'+e);
          return done(e);
        }
      }
    )
  );

  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      if (!username || !password) {
        selectedLogger.error('faltan datos');
        return done(null, false);
      }
      try {
        const user = await UserModel.findOne({ email: username });
        if (!user) {
          selectedLogger.error('user not found');
          return done(null, false);
        }
        if (!isValidPassword(password, user.password)) {
          selectedLogger.error('wrong password');
          return done(null, false);
        }
        selectedLogger.info('User logged in succesfully');
        return done(null, user);
      } catch (err) {
        selectedLogger.error('Error in login'+err);
        return done(err);
      }
    })
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { firstName, lastName, age, email, password } = req.body;
          if (!firstName || !lastName || !age || !email || !password) {
            return res.status(400).render('error-page', { msg: 'faltan datos' });
          }
          let user = await UserModel.findOne({ email: username });
          if (user) {
            selectedLogger.error('User already exists');
            return done(null, false);
          }
          let newuser = await UserModel.create({ firstName, lastName, age, email, password: createHash(password), rol: 'user' });
          selectedLogger.info('User Registration succesful');
          return done(null, newuser);
        } catch (e) {
          selectedLogger.error('Error in register'+e);
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id);
    done(null, user);
  });
}
