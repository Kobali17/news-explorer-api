const Article = require('../models/article');
const ForbiddenError = require('../middlewares/errors/forbidden-err');
const NotFoundError = require('../middlewares/errors/not-found-err');

module.exports.getCards = (req, res) => {
  Article.find({}).then((cards) => {
    res.send(cards);
  }).catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  return Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Article.findById(req.params.articleId).orFail(new NotFoundError('Карточка не найдена')).then((card) => {
    if (card.owner.toString() === req.user._id.toString()) {
      Article.findByIdAndDelete(card._id).then(() => res.status(200).send(card)).catch(next);
    } else {
      throw new ForbiddenError('Недостаточно прав');
    }
  })
    .catch(next);
};
