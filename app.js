const express = require('express');
require('dotenv').config(); // env-переменные из файла .env добавил в process.env
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, errors, Joi } = require('celebrate');
const helmet = require('helmet');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { messageList } = require('./utils/utils');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { handleError } = require('./errors/err');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser()); // => токен в req.cookies.token
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet()); // заголовки безопасности - проставить автоматически

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// роуты, не требующие авторизации
app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }).unknown(), // доп. поля разрешены
  }),
  login);

app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).pattern(new RegExp('^[a-z0-9\\.\\-\\_\\s]{2,30}$', 'i')),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().min(6),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  createUser);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/users',
  celebrate({
    cookies: Joi.object().keys({
      token: Joi.string().required().min(20), // ////////////////// hex
    }),
  }),
  usersRoutes);

app.use('/cards',
  celebrate({
    cookies: Joi.object().keys({
      token: Joi.string().required().min(20),
    }),
  }),
  cardsRoutes);

// переход на несуществующий роут
app.use((req, res, next) => {
  const err = new NotFoundError(messageList.notFoundPage);
  next(err);
});

app.use(errors()); // обработчик ошибок celebrate

app.use(handleError); // единый обработчик

app.listen(PORT, () => {
  console.log(`порт на ${(PORT)}`);
});
