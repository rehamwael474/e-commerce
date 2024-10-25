import Stripe from "stripe"
import { Cart, Coupon, Order, Product } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"

import { clearCart, updateProductQuantity } from "./services/order.service.js"

// create order
export const createOrder = async (req,res,next) => {
    // get data from req
    const { address, phone, payment, coupon } = req.body
    // check coupon
    let couponExist;
    if(coupon){
         couponExist = await Coupon.findOne({ code: coupon})
        if(!couponExist){
            return next(new AppError(messages.coupon.notFound, 404))
        }
        if( couponExist.fromDate > Date.now() || couponExist.toDate < Date.now()){
            return next(new AppError('invalid coupon'))
        }
    }
    // check cart
    const cart = await Cart.findOne({ user: req.authUser._id })
    if(cart.products.length == 0){
        return next(new AppError('empaty cart', 400))
    }
    let products = cart.products
    //let productIds = products.map((products) => product.productId)
    //Prouduct.find({_id: {$in: productIds}})// [{}, {}, {}, {}]
    let orderProuducts = []
    let orderPrice = 0
    for (const product of products) {
       // check existence
       const productExist = await Product.findById(product.prodctId)//{}, null
       if(!productExist){
        return next(new AppError(messages.product.notFound, 404))
       }
       //check quantity
       if(!productExist.inStock(product.quantity)){
        return next(new AppError('out of stock', 400))
       }
       orderProuducts.push({
        productId: product._id,
        name: productExist.name,
        itemPrice: productExist.price,
        finalPrice: productExist.finalPrice * product.quantity,
        quantity: product.quantity
     })
     orderPrice += productExist.finalPrice
    }
    let finalPrice = 0
    if(couponExist?.discountType == discountTypes.FIXED_AMOUNT){
        finalPrice = orderPrice - couponExist.discountAmount
    } else if(couponExist?.discountType == discountTypes.PERCENTAGE){
        finalPrice = orderPrice - (orderPrice * couponExist.discountAmount) / 100
    }
    // prepare order
    const order = new Order({
        user: req.authUser._id,
        address,
        phone,
        paymentMethod: payment,
        products: orderProuducts,
        orderPrice,
        finalPrice: finalPrice == 0 ? orderPrice : finalPrice
    })
    // add to db
    const createdOrder = await order.save()
    if(!createOrder){
        return next(new AppError(messages.order.failToCreate, 500))
    }
    // cash >> update products quantity & clear cart
    if(payment == paymentMethods.CASH){
        const result = await clearCart(req.authUser._id)
        if(result.errMessage){
            return next(new AppError(result.errMessage, 500))
        }
        // update products quantity
        for(const product of products) {
            await updateProductQuantity(product.prodctId, product.quantity)
        }
    }
    // visa >> 
    if(payment == paymentMethods.VISA){
        const stripe = new Stripe(process.env.STRIPE_KEY)
        const { url }= await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            success_url: 'https://www.facebook.com',
            cancel_url: 'https://google.com',
            line_items: createdOrder.products.map((product) => {
                return {
                    
                    price_data: {
                        currency: 'egy',
                        product_data: {
                            name: product.name,
                            // images
                        },
                        unit_amount: product.finalPrice * 100
                    },
                    quantity: product.quantity
                }
            })
        })
        return res.status(200).json({ url })
    }
    // send response
    return res.status(201).json({
        message: messages.order.createdSuccessfully,
        data: createdOrder
    })
}

// get all orders
export const getAllOrder = async (req,res,next)  => {
    const getOrder = await Order.find()
    return res.status(200).json({success: true, data: getOrder})
}