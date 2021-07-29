const Card = require('../models/card');

const badRequestCode = 400;
const badRequestMessageCreateCard = 'Переданы некорректные данные при создании карточки.';
const badRequestMessageGetCards = 'Переданы некорректные данные.';
const badRequestMessageSetLike = 'Переданы некорректные данные для постановки лайка';
const badRequestMessageDeleteLike = 'Переданы некорректные данные для снятия лайка';
const notFoundCode = 404;
const notFoundMessageCard = 'Карточка с указанным _id не найдена.';
const internalServerErrorCode = 500;

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestCode).send({ message: badRequestMessageGetCards });
      }
      res.status(internalServerErrorCode).send({ message: err.message });
    });
};

module.exports.createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestCode).send({ message: badRequestMessageCreateCard });
      }
      res.status(internalServerErrorCode).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove({ _id: cardId })
    .then((card) => {
      if (!card) {
        res.status(notFoundCode).send({ message: notFoundMessageCard });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(notFoundCode).send({ message: notFoundMessageCard });
      }
      res.status(internalServerErrorCode).send({ err });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // $addToSet - оператор (чтобы добавить эл-т в массив, если его там ещё нет)
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFoundCode).send({ message: notFoundMessageCard });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestCode).send({ message: badRequestMessageSetLike });
      }
      res.status(internalServerErrorCode).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFoundCode).send({ message: notFoundMessageCard });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestCode).send({ message: badRequestMessageDeleteLike });
      }
      res.status(internalServerErrorCode).send({ message: err.message });
    });
};
