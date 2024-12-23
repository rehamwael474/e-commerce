import Stripe from "stripe"
import { asyncHandler,globalErrorHandling } from "../middleware/asyncHandler.js"
import {authRouter, brandRouter, cartRouter, categoryRouter, couponRouter, orderRouter, productRouter, reviewRouter, subcategoryRouter, wishListRouter} from "./index.js"
import { Cart, Order, Product } from "../../db/index.js"


export const initApp = (app,express) => {
    // parse req
    app.post(
        "/webhook",
         express.raw({ type: 'application/json'}),
    asyncHandler(async (req,res) => {
        const sig= req.headers['stripe-signature'].toString()
        const stripe = new Stripe(process.env.STRIPE_KEY)
        let event = Stripe.webhooks.constructEvent(
           req.body,
            sig,
            ''
            )
            if(event.type == 'checkout.session.completed'){
                const checkout = event.data.object
                const orderId = checkout.metadata.orderId
                const cartId = checkout.metadata.cartId
                // clear cart
                await Cart.findByIdAndUpdate(cartId, {products: []})
                // update order status
                const order = await Order.findByIdAndUpdate(orderId, {
                    status: 'palced'
                })
                let products = order.products
                for(const product of products){
                    await Product.findByIdAndUpdate(product.productId, {
                        $inc: { stock: -product.quantity}
                    })
                }
            }
            // return a 200 res to acknowledge receipt of the order
            res.json({ message: 'web hook completed from reham'})
        })
     )
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