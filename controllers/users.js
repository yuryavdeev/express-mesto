const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { codeList, messageList } = require('../utils/utils');

module.exports.login = (req, res) => {
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
    .catch((err) => {
      res.status(codeList.unauthorized).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 8)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(codeList.badRequest).send({
          message:
            err.errors.email ? err.errors.email.message : messageList.badRequestCreateUser,
        });
      }
      res.status(codeList.internalServerError).send({ message: err.message });
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(codeList.internalServerError).send({ message: err.message }));
};

module.exports.getMe = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(codeList.badRequest).send({ message: messageList.badRequestGetUser });
      }
      res.status(codeList.internalServerError).send({ message: err.message });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(codeList.notFound).send({ message: messageList.notFoundGetUser });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(codeList.badRequest).send({ message: messageList.badRequestGetUser });
      }
      res.status(codeList.internalServerError).send({ message: err.message });
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
    .then((user) => {
      if (!user) {
        return res.status(codeList.notFound).send({ message: messageList.notFoundGetUser });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(codeList.badRequest).send({ message: messageList.badRequestUpdateUser });
      }
      res.status(codeList.internalServerError).send({ message: err.message });
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
    .orFail(() => {
      const error = new Error();
      error.statusCode = codeList.notFound;
      // throw генерир. искл-я, текущ ф-я будет ост-на и упр-е будет передано в первый блок catch
      throw error;
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(codeList.badRequest).send({ message: messageList.badRequestUpdateAvatar });
      }
      if (err.statusCode === codeList.notFound) {
        res.status(codeList.notFound).send({ message: messageList.notFoundUpdateUser });
      }
      res.status(codeList.internalServerError).send({ err });
    });
};
