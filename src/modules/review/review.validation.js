import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addReviewVal = joi.object({
    comment: joi.string(),
    rate: joi.number().min(0).max(5)
})