import { Router } from "express";
import { cloudUploads } from "../../utils/multer-cloud.js";
import { isValid } from "../../middleware/validation.js";
import { addProductVal, updateProductVal } from "./product.validation.js";
import {asyncHandler} from "../../middleware/asyncHandler.js"
import { addProduct, deleteProduct, getAllProducts, getSpecificProduct, updateProduct } from "./product.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";

const productRouter = Router()
// add product 
productRouter.post('/',
    isAuthenticated(),
    isAuthourized([roles.ADMIN,roles.SELLER]),
    cloudUploads({}).fields([{name:'mainImage',maxCount: 1}, {name: "subImages", maxCount:10}]),
    isValid(addProductVal),
    asyncHandler(addProduct)
)

// get all products
productRouter.get('/', asyncHandler(getAllProducts))

// update product
productRouter.put('/:productId',
    isAuthenticated(),
    isAuthourized([roles.ADMIN, roles.SELLER]),
    isValid(updateProductVal),
    asyncHandler(updateProduct)
)


// get specific product
productRouter.get('/:productId', asyncHandler(getSpecificProduct))

// delete product
productRouter.delete('/:productId', 
    isAuthenticated(),
    isAuthourized([roles.ADMIN, roles.SELLER]),
    asyncHandler(deleteProduct)
)
export default productRouter

