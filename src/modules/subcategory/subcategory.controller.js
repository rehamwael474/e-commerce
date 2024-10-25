import slugify from "slugify"
import { Category, Subcategory } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"

//add subcategory
export const addSubcategory = async (req,res,next) => {
 // get data from req
 let {name,category} = req.body
 name = name.toLowerCase()
 // check existence
 const categoryExist = await Category.findById(category)
 if(!categoryExist){
    return next (new AppError(messages.category.notFound,404))
 }
 const subcategoryExist = await Subcategory.findOne({name})
 if(subcategoryExist){
    return next(new AppError(messages.subcategory.alreadyExist,409))
 }
 // prepare data
 const slug = slugify(name,{replacement:"_"})
 const subcategory =  new Subcategory({
    name,
    slug,
    image: {path: req.file?.path},
    category,
    createdBy:req.authUser._id,

 })
 // add to db
 const createdSubcategory = await subcategory.save()
 if(!createdSubcategory){
    return next(new AppError(messages.subcategory.failToCreate,500))

 }
 // response 
 return res.status(201).json({
   message:messages.subcategory.createdSuccessfully,
   success:true,
   data:createdSubcategory
})

}

// update Subcategory
export const updateSubcategory = async (req,res,next) => {
   // get data from req
   let { name } = req.body
   const { subcategoryId } = req.params
   name = name.toLowerCase()
   // check existence
   const subcategoryExist = await Subcategory.findById(subcategoryId)//{}, null
   if(!subcategoryExist){
       return next(new AppError(messages.subcategory.notFound, 404))
   }
   // check name
   const nameExist = await Subcategory.findOne({ name })//{}, null
   if(nameExist){
       return next(new AppError(messages.subcategory.alreadyExist, 409))
   }
   // prepare data
   const slug = slugify(name)
   subcategoryExist.name = name
   subcategoryExist.slug = slug
   // update image
   const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
       public_id: subcategoryExist.public_id
   })
   subcategoryExist.image = { secure_url, public_id }
   req.failImage = { secure_url, public_id }
   // add to db
   const updatedSubcategory = subcategoryExist.save()//{}, null
   if(!updatedSubcategory){
       return next(new AppError(messages.subcategory.failToUpdate, 500))
   }
   // send response
   return res.status(200).json({
       message: messages.subcategory.updatedSuccessfully,
       success: true,
       data: updatedSubcategory
   })


}

// get all subcategroies
export const getAllSubategroies = async (req,res,next) => {
   const subcategories = await Subcategory.find()
   return res.status(200).json({success: true, data: subcategories})
}

// get specific subcategroy
export const getSpecificSubcategroy = async (req,res,next) => {
   // get data from req
   const {subcategoryId} = req.params
   const getSpecific = await Subcategory.findById(subcategoryId)
   // send response
   return res.status(200).json({ data: getSpecific,success: true,})
}

// delete subcategroy
export const deleteSubcategroy = async (req,res,next) => {
   // get data feom req
   const { subcategoryId } = req.params
   // delete
   const deletedSubcategory = await Subcategory.deleteOne({ _id: subcategoryId })
   // send response
   return res.status(200).json({message: messages.subcategory.deletedSuccessfuly, success: true})
}