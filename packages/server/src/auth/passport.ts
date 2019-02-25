import * as passport from "koa-passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getRepository } from "typeorm";

import { User } from "server/src/entities/User";

passport.serializeUser<User, string>((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userRepo = getRepository(User);

    const user = await userRepo.findOne(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    fetchUser()
      .then(user => {
        if (username === user.username && password === user.password) {
          done(null, user);
        } else {
          done(null, false);
        }
      })
      .catch(err => done(err));
  })
);
