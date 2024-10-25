import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'




export const createOrderVal = joi.object({
    address: joi.string().required(),
    phone: generalFields.phone.required(),
    payment: joi.string().required(),
    coupon: joi.string().required(),
    
})