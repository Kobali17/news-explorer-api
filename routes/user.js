const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUser, login, createUser } = require('../controllers/user');

router.get('/users/me', getUser);

router.post('/api/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.post('/api/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

module.exports = router;
