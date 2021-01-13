const router = require('express').Router();

const {
  getCards, createCard, deleteCard
} = require('../controllers/article');

router.get('/articles', getCards);
router.post('/articles', createCard);
router.delete('/articles/articleId', deleteCard);

module.exports = router;