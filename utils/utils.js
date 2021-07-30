const codeList = {
  badRequest: 400,
  notFound: 404,
  internalServerError: 500,
};

const messageList = {
  badRequestCreateUser: 'Переданы некорректные данные при создании пользователя.',
  badRequestUpdateUser: 'Переданы некорректные данные при обновлении профиля.',
  badRequestUpdateAvatar: 'Переданы некорректные данные при обновлении аватара.',
  badRequestGetUser: 'Переданы некорректные данные для получения данных пользователя.',
  notFoundGetUser: 'Пользователь по указанному _id не найден.',
  notFoundUpdateUser: 'Пользователь с указанным _id не найден.',

  badRequestCreateCard: 'Переданы некорректные данные при создании карточки.',
  badRequestDeleteCard: 'Переданы некорректные данные при удалении карточки',
  badRequestSetLike: 'Переданы некорректные данные для постановки лайка',
  badRequestDeleteLike: 'Переданы некорректные данные для снятия лайка',
  notFoundCard: 'Карточка с указанным _id не найдена.',

  notFoundPage: 'Страница не существует',
};

module.exports = { codeList, messageList };
