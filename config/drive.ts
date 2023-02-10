/**
 * Config source: https://git.io/JBt3o
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import Application from '@ioc:Adonis/Core/Application'
import { driveConfig } from '@adonisjs/core/build/config'

/*
|--------------------------------------------------------------------------
| Drive Config
|--------------------------------------------------------------------------
|
| The `DriveConfig` relies on the `DisksList` interface which is
| defined inside the `contracts` directory.
|
*/
export default driveConfig({
	/*
  |--------------------------------------------------------------------------
  | Default disk
  |--------------------------------------------------------------------------
  |
  | The default disk to use for managing file uploads. The value is driven by
  | the `DRIVE_DISK` environment variable.
  |
  */
	disk: Env.get('DRIVE_DISK'),

	disks: {
		/*
    |--------------------------------------------------------------------------
    | Local
    |--------------------------------------------------------------------------
    |
    | Uses the local file system to manage files. Make sure to turn off serving
    | files when not using this disk.
    |
    */
		local: {
			driver: 'local',
			visibility: 'public',

			/*
      |--------------------------------------------------------------------------
      | Storage root - Local driver only
      |--------------------------------------------------------------------------
      |
      | Define an absolute path to the storage directory from where to read the
      | files.
      |
      */
			root: Application.tmpPath('uploads'),

			/*
      |--------------------------------------------------------------------------
      | Serve files - Local driver only
      |--------------------------------------------------------------------------
      |
      | When this is set to true, AdonisJS will configure a files server to serve
      | files from the disk root. This is done to mimic the behavior of cloud
      | storage services that has inbuilt capabilities to serve files.
      |
      */
			serveFiles: true,

			/*
      |--------------------------------------------------------------------------
      | Base path - Local driver only
      |--------------------------------------------------------------------------
      |
      | Base path is always required when 'serveFiles = true'. Also make sure
      | the `basePath` is unique across all the disks using 'local' driver and
      | you are not registering routes with this prefix.
      |
      */
			basePath: '/uploads',
		},

		/*
    |--------------------------------------------------------------------------
    | S3 Driver
    |--------------------------------------------------------------------------
    |
    | Uses the S3 cloud storage to manage files. Make sure to install the s3
    | drive separately when using it.
    |
    |**************************************************************************
    | npm i @adonisjs/drive-s3
    |**************************************************************************
    |
    */
		// s3: {
		//   driver: 's3',
		//   visibility: 'public',
		//   key: Env.get('S3_KEY'),
		//   secret: Env.get('S3_SECRET'),
		//   region: Env.get('S3_REGION'),
		//   bucket: Env.get('S3_BUCKET'),
		//   endpoint: Env.get('S3_ENDPOINT'),
		//
		//  // For minio to work
		//  // forcePathStyle: true,
		// },

		/*
    |--------------------------------------------------------------------------
    | GCS Driver
    |--------------------------------------------------------------------------
    |
    | Uses the Google cloud storage to manage files. Make sure to install the GCS
    | drive separately when using it.
    |
    |**************************************************************************
    | npm i @adonisjs/drive-gcs
    |**************************************************************************
    |
    */
		// gcs: {
		//   driver: 'gcs',
		//   visibility: 'public',
		//   keyFilename: Env.get('GCS_KEY_FILENAME'),
		//   bucket: Env.get('GCS_BUCKET'),

		/*
      |--------------------------------------------------------------------------
      | Uniform ACL - Google cloud storage only
      |--------------------------------------------------------------------------
      |
      | When using the Uniform ACL on the bucket, the 'visibility' option is
      | ignored. Since, the files ACL is managed by the google bucket policies
      | directly.
      |
      |**************************************************************************
      | Learn more: https://cloud.google.com/storage/docs/uniform-bucket-level-access
      |**************************************************************************
      |
      | The following option just informs drive whether your bucket is using uniform
      | ACL or not. The actual setting needs to be toggled within the Google cloud
      | console.
      |
      */
		//   usingUniformAcl: false,
		// },
	},
})

export const IMG_PLACEHOLDER = 'placeholder.jpg'

export const UPLOAD_TUTORIAL_FOLDER_PATH = 'UploadTutorials'

export const PARTNERS_FOLDER_PATH = 'Partners'

export const NEWS_FOLDER_PATH = 'News'

export const BANNER_FOLDER_PATH = 'Banners'

export const ADVERTISEMENT_FOLDER_PATH = 'Ads'

export const OUR_PARTNERS_FOLDER_PATH = 'OurPartners'

export const USER_FOLDER_PATH = 'Users'

export const OFFER_FOLDER_PATH = 'Offers'

export const MAIN_PAGE_VIDEO_FOLDER_PATH = 'MainPageVideo'
