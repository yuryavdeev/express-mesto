const Card = require('../models/card');

const { codeList, messageList } = require('../utils/utils');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(codeList.internalServerError).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(codeList.badRequest).send({ message: messageList.badRequestCreateCard });
      }
      res.status(codeList.internalServerError).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove({ _id: cardId })
    .then((card) => {
      if (!card) {
        return res.status(codeList.notFound).send({ message: messageList.notFoundCard });
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(codeList.badRequest).send({ message: messageList.badRequestDeleteCard });
      }
      res.status(codeList.internalServerError).send({ message: err.message });
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
        return res.status(codeList.notFound).send({ message: messageList.notFoundCard });
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(codeList.badRequest).send({ message: messageList.badRequestSetLike });
      }
      res.status(codeList.internalServerError).send({ message: err.message });
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
        return res.status(codeList.notFound).send({ message: messageList.notFoundCard });
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(codeList.badRequest).send({ message: messageList.badRequestDeleteLike });
      }
      res.status(codeList.internalServerError).send({ message: err.message });
    });
};
