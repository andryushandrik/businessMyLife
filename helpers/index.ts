import cyrillicToTranslit from 'cyrillic-to-translit-js'
import { string as helperString } from '@ioc:Adonis/Core/Helpers'

export function formatStringForCyrillic(val: string, style: 'camelCase' | 'snakeCase', replacement?: string): string {
  val = cyrillicToTranslit().transform(val, replacement)

  return helperString[style](val)
}
