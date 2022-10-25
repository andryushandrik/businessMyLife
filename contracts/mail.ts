/**
 * Contract source: https://git.io/JvgAT
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

// * Types
import type mailConfig from '../config/mail'
import type { InferMailersFromConfig } from '@adonisjs/mail/build/config'
// * Types

declare module '@ioc:Adonis/Addons/Mail' {
  interface MailersList extends InferMailersFromConfig<typeof mailConfig> {}
}
