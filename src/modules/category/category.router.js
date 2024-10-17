import { Router } from "express";
import { fileUploads } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { addCategoryVal } from "./category.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addCategory, getAllCategories } from "./category.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";



const categoryRouter = Router()

// add category 
categoryRouter.post('/',fileUploads({folder: "category"}).single('image'),
isAuthenticated(),
isAuthourized([roles.Admin,roles.SELLER]),
isValid(addCategoryVal),
asyncHandler(addCategory)
)

// get categories
categoryRouter.get('/',asyncHandler(getAllCategories))


export default categoryRouter