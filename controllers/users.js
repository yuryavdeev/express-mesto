const User = require('../models/user');

const badRequestCode = 400;
const badRequestMessageCreateUser = 'Переданы некорректные данные при создании пользователя.';
const badRequestMessageGetUsers = 'Переданы некорректные данные.';
const badRequestMessageUpdateUser = 'Переданы некорректные данные при обновлении профиля.';
const badRequestMessageUpdateAvatar = 'Переданы некорректные данные при обновлении аватара.';
const notFoundCode = 404;
const notFoundMessageGetUser = 'Пользователь по указанному _id не найден.';
const notFoundMessageUpdateUser = 'Пользователь с указанным _id не найден.';
const internalServerErrorCode = 500;

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestCode).send({ message: badRequestMessageCreateUser });
      }
      res.status(internalServerErrorCode).send({ message: err.message });
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        res.status(badRequestCode).send({ message: badRequestMessageGetUsers });
      }
      res.status(internalServerErrorCode).send({ message: err.message });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(notFoundCode).send({ message: notFoundMessageGetUser });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(notFoundCode).send({ message: notFoundMessageGetUser });
      }
      res.status(internalServerErrorCode).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestCode).send({ message: badRequestMessageUpdateUser });
      }
      if (err.name === 'CastError') {
        res.status(notFoundCode).send({ message: notFoundMessageUpdateUser });
      }
      res.status(internalServerErrorCode).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestCode).send({ message: badRequestMessageUpdateAvatar });
      }
      if (err.name === 'CastError') {
        res.status(notFoundCode).send({ message: notFoundMessageUpdateUser });
      }
      res.status(internalServerErrorCode).send({ message: err.message });
    });
};
