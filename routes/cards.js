const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { checkUrl } = require('../utils/utils');

const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);

router.post('/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(checkUrl), // <<<===
    }).unknown(),
  }),
  createCard);

router.delete('/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }).unknown(),
  }),
  deleteCard);

router.put('/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }).unknown(),
  }),
  likeCard);

router.delete('/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }).unknown(),
  }),
  dislikeCard);

module.exports = router;
