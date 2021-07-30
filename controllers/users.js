const User = require('../models/user');

const { codeList, messageList } = require('../utils/utils');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(codeList.badRequest).send({ message: messageList.badRequestCreateUser });
      }
      res.status(codeList.internalServerError).send({ message: err.message });
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(codeList.internalServerError).send({ message: err.message }));
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
        res.status(codeList.badRequest).send({ message: messageList.badRequestGetUser });//
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
      const error = new ReferenceError();
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
