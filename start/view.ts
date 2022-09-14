import View from '@ioc:Adonis/Core/View'
import { IMG_PLACEHOLDER } from 'Config/drive'

View.global('getImage', (imgPath: string | null) => {
    //To properly display images from faker...Not nec
    if(imgPath && !imgPath.startsWith('http')){
        return `/uploads/${imgPath}` 
    }
    return imgPath ?? IMG_PLACEHOLDER
})
