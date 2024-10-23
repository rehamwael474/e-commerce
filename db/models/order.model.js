import { model, Schema } from "mongoose";
import { orderStatus, paymentMethod } from "../../src/utils/constant/enums.js";

// schema
const orderSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    products:[
        {
            productId:{
                type:Schema.Types.ObjectId,
                ref:"Product"
            },
            quantity:Number,
            price:Number, // 1000
            name:String,
            finalPrice:Number, // 4000
            discount:Number // 50%
        }
    ],
    address:{
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
     paymentMethod:{
       type:String,
       enum: Object.values(paymentMethod),
       default:paymentMethod.CASH
     },
     status:{
        type:String,
        enum: Object.values(orderStatus),
        default: orderStatus.PLACED
     },
     coupon:{
        couponId:{type: Schema.Types.ObjectId,
         ref:"Coupon"},
        code:String,
        discount:Number
     },
     orderPrice:Number,
     finalPrice:Number
    
},{timestamps:true})

//model
export const Order = model('Order',orderSchema)