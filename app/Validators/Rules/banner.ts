import { rules } from "@ioc:Adonis/Core/Validator"
import { BANNERS_DESCRIPTION_MAX_LENGTH } from 'Config/database'

export function getBannerTitleRules(){
    return [
        rules.minLength(5),
        rules.maxLength(255)
    ]
}

export function getBannerDescriptionRules(){
    return [
        rules.minLength(10),
        rules.maxLength(BANNERS_DESCRIPTION_MAX_LENGTH)
    ]
}

export function getBannerFileOptions(){
    return {
        size: "5mb",
        extnames: ['jpeg', 'png', 'jpg']
    }
}