const jwt = require('jsonwebtoken');

const { messageList } = require('../utils/utils');
const UnauthorizedError = require('../errors/unauthorized-err');
const ForbiddenError = require('../errors/forbidden');

module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env; // env-переменные из process.env
  if (!req.cookies.token) {
    const err = new ForbiddenError(messageList.forbiddenMessage);
    next(err);
  }
  let payload;
  try {
    // метод jwt.verify вернёт пейлоуд токена, если тот прошёл проверку
    payload = jwt.verify(req.cookies.token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    const err = new UnauthorizedError(messageList.unauthorizedCheckAuthMessage);
    next(err);
  }
  // пейлоуд с данными пользователя (_id) в объект запроса
  req.user = payload;
  next();
};
