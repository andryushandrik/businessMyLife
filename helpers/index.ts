import cyrillicToTranslit from 'cyrillic-to-translit-js'
import { string as helperString } from '@ioc:Adonis/Core/Helpers'

export function formatStringForCyrillic(val: string, style: 'camelCase' | 'snakeCase', replacement?: string): string {
  val = cyrillicToTranslit().transform(val, replacement)

  return helperString[style](val)
}

export function getRandom(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min + 1)) + min
}
