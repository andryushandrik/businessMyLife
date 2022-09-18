/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from "@ioc:Adonis/Core/Env";
import { DatabaseConfig } from "@ioc:Adonis/Lucid/Database";

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
  connection: Env.get("DB_CONNECTION"),

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
      client: "pg",
      debug: false,
      healthCheck: false,
      migrations: {
        naturalSort: true,
      },
      seeders: {
        paths: ["./database/seeders/MainSeeder"],
      },
      connection: {
        host: Env.get("PG_HOST"),
        port: Env.get("PG_PORT"),
        user: Env.get("PG_USER"),
        password: Env.get("PG_PASSWORD", ""),
        database: Env.get("PG_DB_NAME"),
      },
    },
  },
};

export default databaseConfig;

export const TABLES_NAMES = {
  NEWS: "news",
  FEEDBACKS: "feedbacks",
  BANNERS: "banners",
  PARTNERS: "partners",

  /**
   * * User
   */

  ROLES: "roles",
  USERS_TYPES: "usersTypes",
} as const;

/**
 * News
 */
export const NEWS_DESCRIPTION_MAX_LENGTH = 8192;
export const NEWS_TITLE_MAX_LENGTH = 1024;
export const NEWS_SLUG_MAX_LENGTH = 1024;
export const NEWS_SUPTITLE_MAX_LENGTH = 1024;

/**
 * FeedBacks
 */

export const FEEDBACK_QUESTION_MAX_LENGTH = 8192;

/**
 * Banners
 */

export const BANNERS_DESCRIPTION_MAX_LENGTH = 2048;

/**
 * Partners
 */

export const PARTNER_IMAGE_MEDIA_TYPE = "0";
export const PARTNER_VIDEO_MEDIA_TYPE = "1";
