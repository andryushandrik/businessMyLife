// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from './IndexValidator'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import {
  getUploadTutorialTitleRules,
  getUploadTutorialEmbedRules,
  getUploadTutorialVideoOptions,
} from './Rules/uploadTutorial'

export default class UploadTutorialValidator extends IndexValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  /**
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    title: schema.string({ trim: true }, getUploadTutorialTitleRules()),

    /**
     * * Optional fields
     */

    isVisible: schema.boolean.optional(),
    video: schema.file.optional(getUploadTutorialVideoOptions(), [ rules.requiredIfNotExists('embed') ]),
    embed: schema.string.optional({ trim: true }, [
      ...getUploadTutorialEmbedRules(),
      rules.requiredIfNotExists('video'),
    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    ...this.messages,
    'embed.requiredIfNotExists': 'Заполните либо это поле, либо поле с видео',
    'video.requiredIfNotExists': 'Заполните либо это поле, либо поле с ссылкой',
  }
}
