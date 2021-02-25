const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const regex = /^(https?:\/\/)?([\da-z\\.-]+)\.([a-z\\.]{2,6})([/\w \\.-]*)*\/?$/gi;
        return regex.test(v);
      },
      message: 'Переданы некорректные данные',
    },
  },
  urlToImage: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const regex = /^(https?:\/\/)?([\da-z\\.-]+)\.([a-z.]{2,6})([/\w \\.-]*)*\/?$/gi;
        return regex.test(v);
      },
      message: 'Переданы некорректные данные',
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);
