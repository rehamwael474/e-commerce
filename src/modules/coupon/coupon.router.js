import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { addCouponVal } from "./coupon.validation.js";
import { addCoupon } from "./coupon.controller.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const couponRouter = Router()
 // add coupon
 couponRouter.post('/',
    isAuthenticated(),
    isAuthourized([roles.ADMIN]),
    isValid(addCouponVal),
    asyncHandler(addCoupon)
    
 )
export default couponRouter