const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { messageList } = require('../utils/utils');
const UnauthorizedError = require('../errors/unauthorized-err');

const regexUrl = /ht{1,2}ps?:\/\/[a-z0-9\\-]+\.[a-z0-9]{2,3}\S*/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },

  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (avatar) => regexUrl.test(avatar),
      // validator: (avatar) => validator.isURL(avatar), // <<<===
      message: 'Ссылка для создания аватара некорректна!', // <= false
    },
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введен неправильный формат почты',
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    // select: false, // => хеш пароля не долж. возвр. из базы (не работает с create, только с find)
  },
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password; // или в контроллере возвращать жестко без пароля
  return obj;
};

// проверка почты и пароля - часть схемы User; добавить свой метод - в св-во statics схемы
userSchema.statics.findUserByCredentials = function (email, password) {
  if (!password || password.length < 6) { // на роуте /signin
    throw new UnauthorizedError(messageList.unauthorizedEmailOrPassword);
  }
  // т.к. нужен хеш пароля => после вызова метода модели - добавить метод select и строку +password:
  return this.findOne({ email }).select('+password') // this - модель User
    .orFail(() => {
      throw new UnauthorizedError(messageList.unauthorizedEmailOrPassword);
    })
    .then((user) => bcrypt.compare(password, user.password) // сравн. пароль и хеш в базе
      .then((matched) => { // вложен в 1-й .then
        if (!matched) {
          throw new UnauthorizedError(messageList.unauthorizedEmailOrPassword);
        }
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
