/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get('DB_CONNECTION'),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | PostgreSQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for PostgreSQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i pg
    |
    */
    pg: {
      client: 'pg',
      debug: false,
      healthCheck: false,
      migrations: {
        naturalSort: true,
      },
      seeders: {
        paths: ['./database/seeders/MainSeeder'],
      },
      connection: {
        host: Env.get('PG_HOST'),
        port: Env.get('PG_PORT'),
        user: Env.get('PG_USER'),
        password: Env.get('PG_PASSWORD', ''),
        database: Env.get('PG_DB_NAME'),
      },
    },
  },
}

export default databaseConfig

export const TABLES_NAMES = {
  NEWS: 'news',
  BANNERS: 'banners',
  FEEDBACKS: 'feedbacks',

  /**
   * * Offer
   */

  AREAS: 'areas',
  SUBSECTIONS: 'subsections',

  /**
   * * User
   */

  USERS: 'users',
  ROLES: 'roles',
  USERS_TYPES: 'usersTypes',
  USERS_IMAGES: 'usersImages',
} as const

/**
 * * Feedback
 */

export const FEEDBACK_QUESTION_MAX_LENGTH: number = 8192

/**
 * * News
 */

export const NEWS_TITLE_MIN_LENGTH: number = 2
export const NEWS_TITLE_MAX_LENGTH: number = 255

export const NEWS_SUPTITLE_MIN_LENGTH: number = 2
export const NEWS_SUPTITLE_MAX_LENGTH: number = 255

export const NEWS_DESCRIPTION_MIN_LENGTH: number = 4
export const NEWS_DESCRIPTION_MAX_LENGTH: number = 8192

/**
 * * Banner
 */

export const BANNER_TITLE_MIN_LENGTH: number = 5
export const BANNER_TITLE_MAX_LENGTH: number = 255

export const BANNER_DESCRIPTION_MIN_LENGTH: number = 10
export const BANNER_DESCRIPTION_MAX_LENGTH: number = 2048

/**
 * * Offer
 */

export const AREA_NAME_MAX_LENGTH: number = 255

export const SUBSECTION_NAME_MAX_LENGTH: number = 255

/**
 * * User
 */

export const USER_PASSWORD_MIN_LENGTH: number = 8
export const USER_PASSWORD_MAX_LENGTH: number = 50
