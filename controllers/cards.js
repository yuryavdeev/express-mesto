const Card = require('../models/card');

const { messageList } = require('../utils/utils');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request');
const ForbiddenError = require('../errors/forbidden');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError(messageList.badRequestCreateCard);
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById({ _id: cardId })
    .orFail(() => {
      throw new NotFoundError(messageList.notFoundCard);
    })
    .then((card) => {
      const cardOwnerId = String(card.owner);
      if (cardOwnerId !== req.user._id) {
        const err = new ForbiddenError(messageList.forbiddenMessage);
        next(err);
      } else {
        card.remove()
          .then(() => res.send(card))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError(messageList.badRequestDeleteCard);
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // $addToSet - оператор добавления эл-та в массив, если его там ещё нет
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError(messageList.notFoundCard);
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new BadRequestError(messageList.badRequestSetLike);
        next(error);
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) { // вариант без .orFail
        throw new NotFoundError(messageList.notFoundCard);
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new BadRequestError(messageList.badRequestDeleteLike);
        next(error);
      }
      next(err);
    });
};
