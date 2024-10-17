import { model, Schema } from "mongoose";
import { type } from "os";
import pkg from "joi";
const { required } = pkg;
//schema
const subcategorySchema = new Schema({
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
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category",
        required:true
    }

}, { timestamps:true })
//model
export const Subcategory = model("Subcategory",subcategorySchema)