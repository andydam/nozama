const express = require('express');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const jsonParser = require('body-parser').json();

const passport = require('./passport');
const products = require('../products');

const redisClient = redis.createClient(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
redisClient.on('error', console.error);

const router = express.Router();

router.use(session({
  store: new RedisStore({
    client: redisClient,
    ttl: 260,
  }),
  secret: 'nozama',
  resave: false,
  saveUninitialized: false,
}));
router.use(passport.initialize());
router.use(passport.session());

router.get(
  '/whoami',
  (req, res) => (req.session.passport ? res.json(req.session.passport.user) : res.sendStatus(401)),
);

router.post('/auth', jsonParser, passport.authenticate('local'), (req, res) =>
  res.set('access-control-allow-credentials', 'true').sendStatus(200));

router.get('/auth', (req, res) =>
  req.session.destroy(() => {
    res.clearCookie('connect.sid').sendStatus(200);
  }));

/*
* Add additional routers below
*/

router.use(products);

module.exports = router;
