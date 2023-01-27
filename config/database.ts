/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

// * Types
import type { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'
// * Types

import Env from '@ioc:Adonis/Core/Env'

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
	PARTNERS: 'partners',
	FEEDBACKS: 'feedbacks',
	PROMO_CODES: 'promoCodes',
	UPLOAD_TUTORIALS: 'uploadTutorials',
	EMAIL_SUBSCRIBERS: 'emailSubscribers',

	/**
	 * * Report
	 */

	REPORTS: 'reports',
	REPORT_TYPES: 'reportTypes',

	/**
	 * * Offer
	 */

	AREAS: 'areas',
	SUBSECTIONS: 'subsections',

	OFFERS: 'offers',
	OFFERS_IMAGES: 'offersImages',
	FAVORITE_OFFERS: 'favoriteOffers',

	/**
	 * * User
	 */

	USERS: 'users',
	ROLES: 'roles',
	FRIENDS: 'friends',
	SESSIONS: 'sessions',
	USERS_IMAGES: 'usersImages',

	/**
	 * * Chat
	 */

	MESSAGES: 'messages',
	CONVERSATIONS: 'conversations',
} as const

/**
 * * Report
 */

export const REPORT_DESCRIPTION_LENGTH = 3000

export const REPORT_TYPE_NAME_MIN_LENGTH = 2
export const REPORT_TYPE_NAME_MAX_LENGTH = 255

/**
 * * Promo code
 */

export const PROMO_CODE_NAME_MIN_LENGTH = 2
export const PROMO_CODE_NAME_MAX_LENGTH = 255

export const PROMO_CODE_CODE_MIN_LENGTH = 4
export const PROMO_CODE_CODE_MAX_LENGTH = 255

/**
 * * Upload tutorial
 */

export const UPLOAD_TUTORIAL_TITLE_MIN_LENGTH = 4
export const UPLOAD_TUTORIAL_TITLE_MAX_LENGTH = 255

export const UPLOAD_TUTORIAL_VIDEO_LINK_MIN_LENGTH = 4
export const UPLOAD_TUTORIAL_VIDEO_LINK_MAX_LENGTH = 1024

/**
 * * Partner
 */

export const PARTNER_TITLE_MIN_LENGTH = 4
export const PARTNER_TITLE_MAX_LENGTH = 255

export const PARTNER_VIDEO_LINK_MIN_LENGTH = 4
export const PARTNER_VIDEO_LINK_MAX_LENGTH = 1024

/**
 * * Feedback
 */

export const FEEDBACK_QUESTION_MIN_LENGTH = 5
export const FEEDBACK_QUESTION_MAX_LENGTH = 8192

/**
 * * Main page video
 */

export const MAIN_PAGE_VIDEO_TITLE_MAX_LENGTH = 255
export const MAIN_PAGE_VIDEO_DESCRIPTION_MAX_LENGTH = 2048

/**
 * * News
 */

export const NEWS_TITLE_MIN_LENGTH = 2
export const NEWS_TITLE_MAX_LENGTH = 255

export const NEWS_SUPTITLE_MIN_LENGTH = 2
export const NEWS_SUPTITLE_MAX_LENGTH = 255

export const NEWS_DESCRIPTION_MIN_LENGTH = 4
export const NEWS_DESCRIPTION_MAX_LENGTH = 8192

/**
 * * Banner
 */

export const BANNER_TITLE_MIN_LENGTH = 5
export const BANNER_TITLE_MAX_LENGTH = 255

export const BANNER_DESCRIPTION_MIN_LENGTH = 10
export const BANNER_DESCRIPTION_MAX_LENGTH = 2048

export const BANNER_LINK_MAX_LENGTH = 2048

/**
 * * Offer
 */

export const AREA_NAME_MAX_LENGTH = 255

export const SUBSECTION_NAME_MAX_LENGTH = 255

export const OFFER_TITLE_MIN_LENGTH = 2
export const OFFER_TITLE_MAX_LENGTH = 255
export const OFFER_DESCRIPTION_MIN_LENGTH = 4
export const OFFER_DESCRIPTION_MAX_LENGTH = 8192
export const OFFER_COOPERATION_TERMS_MIN_LENGTH = 4
export const OFFER_COOPERATION_TERMS_MAX_LENGTH = 8192
export const OFFER_BUSINESS_PLAN_MIN_LENGTH = 4
export const OFFER_BUSINESS_PLAN_MAX_LENGTH = 8192
export const OFFER_ABOUT_MIN_LENGTH = 4
export const OFFER_ABOUT_MAX_LENGTH = 8192
export const OFFER_ABOUT_COMPANY_MIN_LENGTH = 4
export const OFFER_ABOUT_COMPANY_MAX_LENGTH = 8192
export const OFFER_BENEFITS_MIN_LENGTH = 4
export const OFFER_BENEFITS_MAX_LENGTH = 8192
export const OFFER_BLOCK_DESCRIPTION_MAX_LENGTH = 1024

/**
 * * User
 */

export const USER_PASSWORD_MIN_LENGTH = 8
export const USER_PASSWORD_MAX_LENGTH = 50

export const USER_COMPANY_NAME_MIN_LENGTH = 1
export const USER_COMPANY_NAME_MAX_LENGTH = 255

export const USER_FIRST_NAME_MIN_LENGTH = 2
export const USER_FIRST_NAME_MAX_LENGTH = 255

export const USER_LAST_NAME_MIN_LENGTH = 2
export const USER_LAST_NAME_MAX_LENGTH = 255

export const USER_PATRONYMIC_MIN_LENGTH = 2
export const USER_PATRONYMIC_MAX_LENGTH = 255

/**
 * * Chat
 */

export const MESSAGE_TEXT_MAX_LENGTH = 8192
