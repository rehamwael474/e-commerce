import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { orderEndpoint } from "./order.endpoint.js";
import { isValid } from "../../middleware/validation.js";
import { createOrderVal } from "./order.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { createOrder } from "./order.controller.js";

const orderRouter = Router()
// create order
orderRouter.post('/',
    isAuthenticated(),
    isAuthourized(orderEndpoint.public),
    isValid(createOrderVal),
    asyncHandler(createOrder)
)
export default orderRouter