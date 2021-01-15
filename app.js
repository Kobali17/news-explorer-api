require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const article = require('./routes/article.js');
const user = require('./routes/user.js');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./middlewares/errors/not-found-err.js');

const app = express();
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const { PORT = 3000 } = process.env;

app.use(requestLogger);
app.use(bodyParser.json());

app.use('/api/signup');
app.use('/api/signin');
app.use('/', auth);
app.use('/api/article*', auth);
app.use('/api', article);
app.use('/api/user*', auth);
app.use('/api', user);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, _) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
      _,
    });
});
app.listen(PORT);
