const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const { messageList } = require('../utils/utils');

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
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Введен неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    select: false, // => по умолчанию хеш пароля не будет возвращаться из базы
  },
});

// код проверки почты и пароля - как часть схемы User:
// чтобы добавить собственный метод - в свойство statics нужной схемы
userSchema.statics.findUserByCredentials = function (email, password) {
  // т.к. нужен хеш пароля => после вызова метода модели - добавить метод select и строку +password:
  return this.findOne({ email }).select('+password') // this - это модель User
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(messageList.unauthorizedCheckEmailAndPassword));
      }
      return bcrypt.compare(password, user.password) // сравн. пароль и хеш в базе
        .then((matched) => { // вложен в 1-й .then
          if (!matched) {
            return Promise.reject(new Error(messageList.unauthorizedCheckEmailAndPassword));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
