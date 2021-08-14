const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { checkUrl } = require('../utils/utils');

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
