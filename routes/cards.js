const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator'); // <<<===
const BadRequestError = require('../errors/bad-request');

const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const checkUrl = (value) => { // <<<===
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new BadRequestError('Необходимо передавать URL!');
};

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
