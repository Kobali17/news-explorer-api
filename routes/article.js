const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, deleteCard,
} = require('../controllers/article');

router.get('/articles', getCards);

router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.object().keys({
      name: Joi.string().required(),
      id: Joi.string(),
    }),
    image: Joi.string().required().uri(),
    link: Joi.string().required().uri(),
  }),
}), createCard);

router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().required().alphanum().length(24),
  }),
}), deleteCard);

module.exports = router;
