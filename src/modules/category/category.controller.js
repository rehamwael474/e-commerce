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
  const { categroyId } = req.params
  // get specific
  const getSpecific = await Categroy.findById(categroyId)
  // send response
  return res.status(200).json({data: getSpecific, success: true})
}

// update categroy
export const updateCategroy = async (req,res,next) => {
  // get data from req
  let { name } = req.body
  const { categroyId } = req.params
  name = name.toLowerCase()
  // check existence
  const categroyExist = await Categroy.findById(categroyId)//{}, null
  if(!categroyExist){
      return next(new AppError(messages.categroy.notFound, 404))
  }
  // check name
  const nameExist = await Categroy.findOne({ name, _id: {$ne: categroyId} })//{}, null
  if(nameExist){
      return next(new AppError(messages.categroy.alreadyExist, 409))
  }
  // prepare data
  const slug = slugify(name)
  categroyExist.name = name
  categroyExist.slug = slug
  // update image
  if(req.file){
     const {sucure_url, public_id } =  await cloudinary.uploader.upload(req.file.path, {
          public_id: categroyExist.image.public_id
      })
      categroyExist.image = {sucure_url, public_id }
      req.failImage = {sucure_url, public_id }
  }
  // add to db
  const updatedCategroy = await categroyExist.save()//{}, null
  if(!updatedCategroy){
      return next(new AppError(messages.categroy.failToUpdate, 500))
  }
  // send response
  return res.status(200).json({
      message: messages.categroy.updatedSuccessfully,
      success: true,
      data: updatedCategroy
  })
}

// delete categroy
export const deleteCategroy = async (req,res,next) => {
  // get data from req
  const {categroyId} = req.params
  // delete categroy
  const deletedCategroy = await Categroy.deleteOne({ _id: categroyId })
  // send response
  return res.status(200).json({
      message: messages.categroy.deletedSuccessfully,
      success: true
  })
}