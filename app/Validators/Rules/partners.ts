import { rules } from "@ioc:Adonis/Core/Validator"

export function getPartnersTitleRules(){
    return [
        rules.minLength(4),
        rules.maxLength(255)
    ]
}

export function getPartnerImageOptions(){
    return {
        size: "5mb",
        extname: ['jpg', 'png', 'jpeg']
    }
}

export function getPartnerVideoRules(){
    return [
        rules.minLength(4),
        rules.maxLength(1024)
    ]
}