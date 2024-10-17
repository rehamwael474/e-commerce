import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addToCart } from "./cart.controller.js";

const cartRouter = Router()
// add to cart
cartRouter.put('/',
    isAuthenticated(),
    isAuthourized([roles.USER]),
    asyncHandler(addToCart)
    
)
export default cartRouter