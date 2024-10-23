import {Router} from  "express"
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addReview, deleteReview, getAllReview, getSpecificReviews } from "./review.controller.js";

const reviewRouter = Router();


// add review
reviewRouter.post('/:productId',
    isAuthenticated(),
    isAuthourized([roles.ADMIN,roles.USER]),
    // validation
    asyncHandler(addReview)

)

// delete
reviewRouter.delete('/:reviewId',
    isAuthenticated(),
    isAuthourized([roles.ADMIN, roles.USER]),
    asyncHandler(deleteReview)
 )
 
 // get
 reviewRouter.get('/',
    isAuthenticated(),
    isAuthourized([roles.ADMIN, roles.USER]),
    asyncHandler(getAllReview)
 )
 
 // sepcific
 reviewRouter.get('/:reviewId',
    isAuthenticated(),
    isAuthourized([roles.ADMIN, roles.USER]),
    asyncHandler(getSpecificReviews)
 )
 
export default reviewRouter