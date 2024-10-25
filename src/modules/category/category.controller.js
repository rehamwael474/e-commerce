//import { Category } from "../../../db/models/category.model.js"

import slugify from "slugify"
import { Category } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import cloudinary from "../../utils/constant/cloud.js"

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

// get specific categroy
export const getSpecificCatregroy = async (req,res,next) => {
  // get data from req
  const { categoryId } = req.params
  // get specific
  const getSpecific = await Category.findById(categoryId)
  // send response
  return res.status(200).json({data: getSpecific, success: true})
}

// update categroy
export const updateCategory = async (req,res,next) => {
  // get data from req
  let { name } = req.body
  const { categoryId } = req.params
  name = name.toLowerCase()
  // check existence
  const categoryExist = await Category.findById(categoryId)
  if(!categoryExist){
      return next(new AppError(messages.category.notFound, 404))
  }
  // check name exist
  const nameExist = await Category.findOne({ name, _id: {$ne: categoryId} })
  if(nameExist){
      return next(new AppError(messages.category.alreadyExist, 409))
  }
  // prepare data
  const slug = slugify(name)
  categoryExist.name = name
  categoryExist.slug = slug
  // update image
  if(req.file){
     const {sucure_url, public_id } =  await cloudinary.uploader.upload(req.file.path, {
          public_id: categoryExist.image.public_id
      })
      categoryExist.image = {sucure_url, public_id }
      req.failImage = {sucure_url, public_id }
  }
  // add to db
  const updateCategory = await categoryExist.save()
  if(!updateCategory){
      return next(new AppError(messages.category.failToUpdate, 500))
  }
  // send response
  return res.status(200).json({
      message: messages.category.updatedSuccessfully,
      success: true,
      data: updateCategory
  })
}

// delete categroy
export const deleteCategory = async (req,res,next) => {
  // get data from req
  const {categoryId} = req.params
  // delete categroy
  const deletedCategory = await Category.deleteOne({ _id: categoryId })
  // send response
  return res.status(200).json({
      message: messages.category.deletedSuccessfuly,
      success: true
  })
}