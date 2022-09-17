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
}
