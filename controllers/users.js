const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { messageList } = require('../utils/utils');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.id }, 'e37b9730f510aa2fce083da3930885e6', { expiresIn: '7d' });
      return res
        // метод express'а установки куков: имя - строка, значение - наш токен:
        .cookie('token', token, { // попадет в заголовок Cookies
          maxAge: 3600000 * 24 * 7, // иначе после закр-я сессии - удалится
          httpOnly: true, // исключили доступ из JavaScript в браузере
          sameSite: true, // отпр. кук - если запрос с этого-же домена
        })
        .end();
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password || password.length < 6) { // на роуте /signup
    throw new BadRequestError(messageList.badRequestCreateUser);
  }
  bcrypt.hash(password, 8)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new Error(messageList.conflictCreateUser);
        error.statusCode = 409;
        next(error);
      } else if (err.name === 'ValidationError') {
        const error = new BadRequestError(
          err.errors.email ? err.errors.email.message : messageList.badRequestCreateUser,
        );
        next(error);
      } else {
        // next(err);
        res.send({ err });
      }
    });
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId ? req.params.userId : req.user._id)
    .orFail(() => {
      throw new NotFoundError(messageList.notFoundUser);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError(messageList.badRequestGetUser);
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      // name: req.body.name ? req.body.name : 'Жак-Ив Кусто',
      // about: req.body.about ? req.body.about : 'Исследователь',
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError(messageList.notFoundUser);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new BadRequestError(messageList.badRequestUpdateUser);
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
      // ? req.body.avatar
      // : 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError(messageList.notFoundUser);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new BadRequestError(messageList.badRequestUpdateUser);
        next(error);
      } else {
        next(err);
      }
    });
};
