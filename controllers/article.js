const Article = require('../models/article');

module.exports.getCards = (req, res) => {
  Article.find({}).then((cards) => {
    res.send(cards);
  }).catch(() => res.status(500).send({message: 'Произошла ошибка'}));
};

module.exports.createCard = (req, res, next) => {
  const {keyword, title, text, date, source, link, image} = req.body;

  return Article.create({keyword, title, text, date, source, link, image})
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Article.findByIdAndDelete(req.params.cardId).orFail().then(() => {
    res.status(200).send();
  })
    .catch(next);
};
