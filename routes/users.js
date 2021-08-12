const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/me', getUser);

router.get('/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required(),
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
      avatar: Joi.string().required(),
    }).unknown(),
  }),
  updateAvatar);

module.exports = router;
