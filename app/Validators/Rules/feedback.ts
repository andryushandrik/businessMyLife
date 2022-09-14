import { rules } from "@ioc:Adonis/Core/Validator"
import { FEEDBACK_QUESTION_MAX_LENGTH } from 'Config/database'

export function getFeedbackNameRules(){
    return [
        rules.minLength(2),
        rules.maxLength(20),
    ]
}

export function getFeedbackEmailRules(){
    return [
        rules.email(),
        rules.normalizeEmail({
            allLowercase: true
        })
    ]
}

export function getFeedbackQuestionRules(){
    return [
        rules.minLength(10),
        rules.maxLength(FEEDBACK_QUESTION_MAX_LENGTH)
    ]
}