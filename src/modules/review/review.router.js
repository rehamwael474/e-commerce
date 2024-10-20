import {Router} from  "express"
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addReview } from "./review.controller.js";

const reviewRouter = Router();


// add review
reviewRouter.post('/:productId',
    isAuthenticated(),
    isAuthourized([roles.ADMIN,roles.USER]),
    // validation
    asyncHandler(addReview)

)

export default reviewRouter