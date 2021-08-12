const jwt = require('jsonwebtoken');

const { messageList } = require('../utils/utils');
const UnauthorizedError = require('../errors/unauthorized-err');
const ForbiddenError = require('../errors/forbidden');

module.exports = (req, res, next) => {
  if (!req.cookies.token) {
    const err = new ForbiddenError(messageList.forbiddenMessage);
    next(err);
  }
  let payload;
  try {
    // метод jwt.verify вернёт пейлоуд токена, если тот прошёл проверку
    payload = jwt.verify(req.cookies.token, 'e37b9730f510aa2fce083da3930885e6');
  } catch (e) {
    const err = new UnauthorizedError(messageList.unauthorizedCheckAuthMessage);
    next(err);
  }
  // пейлоуд с данными пользователя (_id) в объект запроса
  req.user = payload;
  next();
};
