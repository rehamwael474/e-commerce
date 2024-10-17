// import categoryRouter from "./category/category.router.js"

import { globalErrorHandling } from "../middleware/asyncHandler.js"
import {authRouter, brandRouter, cartRouter, categoryRouter, couponRouter, orderRouter, productRouter, reviewRouter, subcategoryRouter, wishListRouter} from "./index.js"

export const initApp = (app,express) => {
    // parse req
    app.use(express.json())
    app.use('/uploads',express.static('uploads'))

    // routing
    app.use('/category',categoryRouter)
    app.use('/subcategory',subcategoryRouter)
    app.use('/brand',brandRouter)
    app.use('/product',productRouter)
    app.use('/auth',authRouter)
    app.use("/review",reviewRouter)
    app.use("/coupon",couponRouter)
    app.use("/wishlist",wishListRouter)
    app.use("/cart",cartRouter)
    app.use('/order',orderRouter)

    // globalErrorHandling
    app.use(globalErrorHandling)

}