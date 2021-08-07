const jwt = require('jsonwebtoken');

const { codeList, messageList } = require('../utils/utils');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.token) {
    return res
      .status(codeList.forbidden)
      .send({ message: messageList.forbiddenMessage });
  }
  let payload;
  try {
    // метод jwt.verify вернёт пейлоуд токена, если тот прошёл проверку
    payload = jwt.verify(req.cookies.token, 'e37b9730f510aa2fce083da3930885e6');
  } catch (err) {
    return res
      .status(codeList.unauthorized)
      .send({ message: messageList.unauthorizedCheckAuthMessage });
  }
  req.user = payload; // пейлоуд в объект запроса
  next();
};
