import { model, Schema } from "mongoose";
// schema
const cartSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    products: [
        {
            proudctId: {type:Schema.Types.ObjectId,
            ref: "Product"
        },
            quantity:Number,
            _id:false
        }
    ]

},{timestamps:true})

//model
export const Cart = model('Cart',cartSchema)