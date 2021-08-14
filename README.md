# Проект реализации удаленного сервера  

Данная работа - реализация back-end для учебного проекта Mesto с помощью фреймворка Express.  
Код разбит на модули, позволяет зарегистрировать пользователя и отредактировать его данные, принимает запросы, связанные с данными пользователя и карточками.  
Реализована централизованная обработка ошибок.  
Авторизация пользователя реализована в отдельном мидлвэре, JWT при авторизации сохраняется в cookies.
Входящие данные валидируются на уровне схем, а также при переходе на роуты - с помощью Joi и библиотеки celebrate.  
Данный проект выполнен в рамках учебного процесса совместно с [Яндекс.Практикум](https://praktikum.yandex.ru/).

_С уважением, Юрий Авдеев._
