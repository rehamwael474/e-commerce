import {Router} from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { isValid } from "../../middleware/validation.js";
import { loginVal, signupVal } from "./auth.validation.js";
import { deleteAccount, login, signup, updateAccount, verifyAccount } from "./auth.controller.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isAuthenticated } from "../../middleware/authentication.js";

const authRouter = Router()

// sign up
authRouter.post('/signup',
    isValid(signupVal),
    asyncHandler(signup))
// verify account
    authRouter.get('/verify/:token',asyncHandler(verifyAccount))   
// login
    authRouter.post('/login',
    isValid(loginVal),
    asyncHandler(login)) 

// update account
authRouter.put('/:userId',
    isAuthenticated(),
    isAuthourized([roles.USER]),
    asyncHandler(updateAccount)
)

// delete account
authRouter.delete('/:userId',
    isAuthenticated(),
    isAuthourized([roles.ADMIN, roles.USER]),
    asyncHandler(deleteAccount)
)

export default authRouter