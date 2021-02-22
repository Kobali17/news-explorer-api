require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const article = require('./routes/article.js');
const user = require('./routes/user.js');
const index = require('./routes/index.js');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./middlewares/errors/not-found-err.js');

const { PORT = 3000, DATABASE_ADDRESS = 'mongodb://localhost:27017/newsdb' } = process.env;

const app = express();
app.use(cors());
mongoose.connect(DATABASE_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);
app.use(bodyParser.json());

app.use('/api', index);
app.use('/api', auth);
app.use('/api', article);
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
app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
