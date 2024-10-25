import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addToCart, getSpecificCart,getAllCart,deleteCart } from "./cart.controller.js";

const cartRouter = Router()
// add to cart
cartRouter.put('/',
    isAuthenticated(),
    isAuthourized([roles.USER]),
    asyncHandler(addToCart)
    
)
// delete cart
cartRouter.delete('/:cartId',
    isAuthenticated(),
    isAuthourized([roles.ADMIN, roles.USER]),
    asyncHandler(deleteCart)
)

// get all carts
cartRouter.get('/',
    isAuthenticated(),
    isAuthourized([roles.ADMIN]),
    asyncHandler(getAllCart)
)
// get specific
cartRouter.get('/:cartId', 
    isAuthenticated(),
    isAuthourized([roles.ADMIN]),
    asyncHandler(getSpecificCart)
)
export default cartRouter