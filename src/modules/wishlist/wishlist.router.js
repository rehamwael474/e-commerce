import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addToWishlist } from "./wishlist.controller.js";

const wishListRouter = Router()


// add to wishlist
wishListRouter.post('/:productId',
    isAuthenticated(),
    isAuthourized([roles.USER,roles.ADMIN]),
    asyncHandler(addToWishlist)
)
export default wishListRouter