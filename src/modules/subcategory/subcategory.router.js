import { Router } from "express";
import { fileUploads } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { addSubcategoryVal, updateSubcategroyVal } from "./subcategory.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addSubcategory, deleteSubcategroy, getAllSubategroies, getSpecificSubcategroy, updateSubcategroy } from "./subcategory.controller.js";
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

// update subcategroy 
subcategoryRouter.put('/:subcategroyId',
    isAuthenticated(),
    isAuthourized([roles.ADMIN, roles.SELLER]),
    isValid(updateSubcategroyVal),
    asyncHandler(updateSubcategroy)
)

// get all subcategroies
subcategoryRouter.get('/', asyncHandler(getAllSubategroies))

// get specific subcategroy
subcategoryRouter.get('/:subcategroyId', asyncHandler(getSpecificSubcategroy))

// delete subcategroy
subcategoryRouter.delete('/:subcategroyId',
    isAuthenticated(),
    isAuthourized([roles.ADMIN, roles.SELLER]),
    asyncHandler(deleteSubcategroy)
)

export default subcategoryRouter