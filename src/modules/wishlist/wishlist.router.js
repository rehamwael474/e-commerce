import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addToWishlist, deleteWishlist, getAllwishlist, getSpecificWishlist } from "./wishlist.controller.js";

const wishListRouter = Router()


// add to wishlist
wishListRouter.post('/:productId',
    isAuthenticated(),
    isAuthourized([roles.USER,roles.ADMIN]),
    asyncHandler(addToWishlist)
)

// delete
wishListRouter.delete('/:wishlistId',
    isAuthenticated(),
    isAuthourized([roles.USER, roles.ADMIN]),
    asyncHandler(deleteWishlist)
)

// get wishlist
wishListRouter.get('/',
    isAuthenticated(),
    isAuthourized([roles.USER, roles.ADMIN]),
    asyncHandler(getAllwishlist)
)

// get specific
wishListRouter.post('/:wishlistId',
    isAuthenticated(),
    isAuthourized([roles.USER, roles.ADMIN]),
    asyncHandler(getSpecificWishlist)
)
export default wishListRouter