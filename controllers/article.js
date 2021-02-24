const Article = require('../models/article');
const ForbiddenError = require('../middlewares/errors/forbidden-err');
const NotFoundError = require('../middlewares/errors/not-found-err');

function getCardRepresentation(card) {
  return {
    _id: card.id,
    keyword: card.keyword,
    title: card.title,
    description: card.description,
    publishedAt: card.publishedAt,
    source: card.source,
    urlToImage: card.urlToImage,
  };
}

module.exports.getCards = (req, res, next) => {
  Article.find({}).then((cards) => {
    res.send(cards.map(getCardRepresentation));
  }).catch(next);
};

module.exports.createCard = (req, res, next) => {
  const {
    keyword, title, description, publishedAt, source, url, urlToImage,
  } = req.body;

  return Article.create({
    keyword, title, description, publishedAt, source, url, urlToImage, owner: req.user._id,
  })
    .then((card) => {
      res.send(getCardRepresentation(card));
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Article.findById(req.params.articleId).orFail(new NotFoundError('Карточка не найдена')).then((card) => {
    if (card.owner.toString() === req.user._id.toString()) {
      Article.findByIdAndDelete(card._id)
        .then(() => res.status(200).send(getCardRepresentation(card))).catch(next);
    } else {
      throw new ForbiddenError('Недостаточно прав');
    }
  })
    .catch(next);
};
