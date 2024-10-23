import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { addCouponVal } from "./coupon.validation.js";
import { addCoupon, deleteCoupon, getAllCoupon, getSpecificCoupon, updateCoupon } from "./coupon.controller.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const couponRouter = Router()
 // add coupon
 couponRouter.post('/',
    isAuthenticated(),
    isAuthourized([roles.ADMIN]),
    isValid(addCouponVal),
    asyncHandler(addCoupon)
    
 )
 
// update coupon
couponRouter.put('/:couponId',
   isAuthenticated(),
   isAuthourized([roles.ADMIN]),
   asyncHandler(updateCoupon)
)

// get all coupon
couponRouter.get('/',
   isAuthenticated(),
   isAuthourized([roles.ADMIN]),
   asyncHandler(getAllCoupon)
)

// get specific coupon
couponRouter.get('/:couponId', 
   isAuthenticated(),
   isAuthourized([roles.ADMIN]),
   asyncHandler(getSpecificCoupon)
)

// delete coupon
couponRouter.delete('/:couponId',
   isAuthenticated(),
   isAuthourized([roles.ADMIN]),
   asyncHandler(deleteCoupon)
)
export default couponRouter