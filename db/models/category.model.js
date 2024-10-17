import { model, Schema } from "mongoose";
import { type } from "os";
import pkg from "joi";
const { required } = pkg;

//schema
const categorySchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true

    },
    image:{
        type:Object

    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref: "User",
        required:true
    }

}, { timestamps:true,toJSON:{virtuals:true} })
categorySchema.virtual('subcategories',{
    ref:"Subcategory",
    localField:"_id",
    foreignField:"category"
})
//model
export const Category = model("Category",categorySchema)