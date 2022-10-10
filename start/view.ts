/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import View from '@ioc:Adonis/Core/View'
import { IMG_PLACEHOLDER } from 'Config/drive'

View.global('getMedia', (imgPath: string | null) => {
  if(imgPath && imgPath.startsWith('http')) // If faker
    return imgPath

  return `/uploads/${imgPath ?? IMG_PLACEHOLDER}`
})
