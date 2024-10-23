import {Router} from "express"
import { cloudUploads } from "../../utils/multer-cloud.js"
import { isValid } from "../../middleware/validation.js"
import { addBrandVal, updateBrandVal } from "./brand.validation.js"
import { asyncHandler } from "../../middleware/asyncHandler.js"
import { addBrand, deleteBrand, getSpecificBrand, updateBrand } from "./brand.controller.js"
import { isAuthenticated } from "../../middleware/authentication.js"
import { isAuthourized } from "../../middleware/authorization.js"
import { roles } from "../../utils/constant/enums.js"

const brandRouter = Router()
// add brand 
brandRouter.post('/',
    isAuthenticated(),
    isAuthourized([roles.ADMIN,roles.SELLER]),
cloudUploads().single('logo'),
isValid(addBrandVal),
asyncHandler(addBrand)
)


// update brand   
brandRouter.put('/:brandId',
    isAuthenticated(),
    isAuthourized([roles.ADMIN,roles.SELLER]),
    cloudUploads({}).single('logo'),
    isValid(updateBrandVal),
    asyncHandler(updateBrand)
)

// get all brands
brandRouter.get('/', asyncHandler())

// get specific brand
brandRouter.get('/:brandId', asyncHandler(getSpecificBrand))

// delete brand
brandRouter.delete('/:brandId', 
    isAuthenticated(),
    isAuthourized([roles.ADMIN, roles.SELLER]),
    asyncHandler(deleteBrand)
)

export default brandRouter