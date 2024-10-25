import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { isValid } from "../../middleware/validation.js";
import { createOrderVal } from "./order.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { createOrder, getAllOrder } from "./order.controller.js";
import { roles } from "../../utils/constant/enums.js";

const orderRouter = Router()
// create order
orderRouter.post('/',
    isAuthenticated(),
    isAuthourized([roles.USER]),
    isValid(createOrderVal),
    asyncHandler(createOrder)
)

// get order
orderRouter.get('/',
    isAuthenticated(),
    isAuthourized([roles.ADMIN]),
    asyncHandler(getAllOrder)
)


export default orderRouter