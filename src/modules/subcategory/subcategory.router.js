import { Router } from "express";
import { fileUploads } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { addSubcategoryVal } from "./subcategory.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addSubcategory } from "./subcategory.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";

const subcategoryRouter = Router()
//add subcategory 
subcategoryRouter.post('/',
    isAuthenticated(),
    isAuthourized([roles.ADMIN,roles.SELLER]),
    fileUploads({folder:"subcategory"}).single('image'),
    isValid(addSubcategoryVal),
    asyncHandler(addSubcategory)

)
export default subcategoryRouter