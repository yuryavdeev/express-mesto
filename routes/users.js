const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator'); // <<<===
const BadRequestError = require('../errors/bad-request');

const checkUrl = (value) => { // <<<===
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new BadRequestError('Необходимо передавать URL!');
};

const {
  getAllUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/me', getUser);

router.get('/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }).unknown(),
  }),
  getUser);

router.patch('/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }).unknown(),
  }),
  updateUser);

router.patch('/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(checkUrl), // <<<===
      // .uri(),
    }).unknown(),
  }),
  updateAvatar);

module.exports = router;
