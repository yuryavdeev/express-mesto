const validator = require('validator'); // <<<===
const BadRequestError = require('../errors/bad-request');

const messageList = {
  badRequestCreateUser: 'Переданы некорректные данные при создании пользователя.',
  badRequestUpdateUser: 'Переданы некорректные данные при обновлении данных пользователя.',
  badRequestGetUser: 'Переданы некорректные данные для получения данных пользователя.',
  notFoundUser: 'Пользователь с указанным _id не найден.',

  badRequestCreateCard: 'Переданы некорректные данные при создании карточки.',
  badRequestDeleteCard: 'Переданы некорректные данные при удалении карточки',
  badRequestSetLike: 'Переданы некорректные данные для постановки лайка',
  badRequestDeleteLike: 'Переданы некорректные данные для снятия лайка',
  notFoundCard: 'Карточка с указанным _id не найдена.',

  notFoundPage: 'Страница не существует',

  conflictCreateUser: 'Профиль с таким e-mail уже существует!',

  unauthorizedEmailOrPassword: 'Почта или пароль введены неправильно',
  unauthorizedCheckAuthMessage: 'Необходима авторизация!',

  forbiddenMessage: 'Нет доступа!',

  serverErrorMessage: 'Ошибка на сервере',
};

const checkUrl = (value) => { // <<<===
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new BadRequestError('Needs URL!');
};

module.exports = { messageList, checkUrl };
