export enum ResponseCodes {
  SUCCESS = 'SUCCESS',

  CLIENT_ERROR = 'CLIENT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  MAILER_ERROR = 'MAILER_ERROR',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  DATABASE_ERROR = 'DATABASE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export enum ResponseMessages {
  SUCCESS = 'Успешно!',
  ERROR = 'Что-то пошло не так, повторите попытку еще раз!',

  /**
   * * Auth
   */

  VALIDATION_ERROR = 'Заполните пожалуйста все поля правильно!',
  TOKEN_ERROR = 'Токен верификации пользователя не найден или просрочен!',
  MISS_AUTH_HEADERS = 'Не найдены необходимые заголовки для авторизации!',
  USER_NOT_FOUND = 'Пользователь не найден!',
}
