import joi from "joi";
import { generalFields } from "../../middleware/validation.js";
import Joi from "joi";


export const addSubcategoryVal= joi.object({
    name:generalFields.name.required(),
    category: generalFields.objectId.required()
})

export const updateSubcategoryVal = joi.object({
    name: generalFields.name
})