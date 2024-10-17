//import { Category } from "../../../db/models/category.model.js"

import slugify from "slugify"
import { Category } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import pkg from 'joi';
const { date } = pkg;

// add category
export const addCategory = async (req,res,next)=>{
    // get data from req
    let {name} = req.body
    name = name.toLowerCase()
    // check existence
    const categoryExist = await Category.findOne({name})
    if(categoryExist){
      return next (new AppError(messages.category.alreadyExist,409))  
    }
    // prepare data
    const slug = slugify(name)
    const category = new Category({
      name,
      slug,
      image: {path: req.file.path},
      createdBy: req.authUser._id,
    })
    const createdCategory = await category.save()
    if(!createdCategory){
      return next (new AppError(messages.category.failToCreate,500))
    }
    //send response 
    return res.status(201).json({message:messages.category.createdSuccessfully,success:true,date:createdCategory})
}

// get all categories
export const getAllCategories = async (req,res,next)=>{
  const categories = await Category.find().populate([{path:"subcategories"}])
  return res.status(200).json({success:true,data:categories})
}