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

// update subcategroy
export const updateSubcategroy = async (req,res,next) => {
   // get data from req
   let { name } = req.body
   const { subcategroyId } = req.params
   name = name.toLowerCase()
   // check existence
   const subcategroyExist = await Subcategroy.findById(subcategroyId)//{}, null
   if(!subcategroyExist){
       return next(new AppError(messages.subcategroy.notFound, 404))
   }
   // check name
   const nameExist = await Subcategroy.findOne({ name })//{}, null
   if(nameExist){
       return next(new AppError(messages.subcategroy.alreadyExist, 409))
   }
   // prepare data
   const slug = slugify(name)
   subcategroyExist.name = name
   subcategroyExist.slug = slug
   // update image
   const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
       public_id: subcategroyExist.public_id
   })
   subcategroyExist.image = { secure_url, public_id }
   req.failImage = { secure_url, public_id }
   // add to db
   const updatedSubcategroy = subcategroyExist.save()//{}, null
   if(!updatedSubcategroy){
       return next(new AppError(messages.subcategroy.failToUpdate, 500))
   }
   // send response
   return res.status(200).json({
       message: messages.subcategroy.updatedSuccessfully,
       success: true,
       data: updatedSubcategroy
   })


}

// get all subcategroies
export const getAllSubategroies = async (req,res,next) => {
   const subcategroies = await Subcategroy.find()
   return res.status(200).json({success: true, data: subcategroies})
}

// get specific subcategroy
export const getSpecificSubcategroy = async (req,res,next) => {
   // get data from req
   const {subcategroyId} = req.params
   const getSpecific = await Subcategroy.findById(subcategroyId)
   // send response
   return res.status(200).json({success: true, data: getSpecific})
}

// delete subcategroy
export const deleteSubcategroy = async (req,res,next) => {
   // get data feom req
   const { subcategroyId } = req.params
   // delete
   const deletedSubcategroy = await Subcategroy.deleteOne({ _id: subcategroyId })
   // send response
   return res.status(200).json({message: messages.subcategroy.deletedSuccessfully, success: true})
}