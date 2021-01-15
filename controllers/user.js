const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../middlewares/errors/unauthorized-err.js');
const NotFoundError = require('../middlewares/errors/not-found-err.js');
const BadRequestError = require('../middlewares/errors/bad-req-err.js');
const User = require('../models/user');

module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    })
      .then((user) => {
        const userData = {
          email: user.email, name: user.name,
        };
        res.send(userData);
      }).catch((err) => {
        if (err.code === 11000) {
          // duplication error
          throw new BadRequestError('Пользователь с таким email уже зарегистрирован');
        } else {
          next(err);
        }
      })).catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user.id).orFail(new NotFoundError('Пользователь не найден')).then((user) => {
    res.send(user);
  })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      let token;
      try {
        token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      } catch (err) {
        throw new UnauthorizedError('Необходима авторизация');
      }
      res.send({ token });
    })
    .catch(next);
};
