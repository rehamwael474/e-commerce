import { Router } from "express";
import { fileUploads } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { addCategoryVal, updateCategoryVal } from "./category.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addCategory,deleteCategroy, getAllCategories, getSpecificCatregroy, updateCategroy } from "./category.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { cloudUploads } from "../../utils/multer-cloud.js";



const categoryRouter = Router()

// add category 
categoryRouter.post('/',fileUploads({folder: "category"}).single('image'),
isAuthenticated(),
isAuthourized([roles.ADMIN,roles.SELLER]),
isValid(addCategoryVal),
asyncHandler(addCategory)
),

// get categories
categoryRouter.get('/',asyncHandler(getAllCategories))

// get specific categroy
categoryRouter.get('/:categroyId', asyncHandler(getSpecificCatregroy))

// update categroy
categoryRouter.put('/:categroyId', 
   isAuthenticated(),
   isAuthourized([roles.ADMIN,roles.SELLER]),
   cloudUploads({}).single('image'),
   isValid(updateCategoryVal),
   asyncHandler(updateCategroy)
)

// delete categroy
categoryRouter.delete('/:categroyId',
   isAuthenticated(),
   isAuthourized([roles.ADMIN, roles.SELLER]),
   asyncHandler(deleteCategroy)
)

export default categoryRouter