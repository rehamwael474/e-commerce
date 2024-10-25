import slugify from "slugify"
import { Brand, Product, Subcategory } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import{messages} from "../../utils/constant/messages.js"
import cloudinary from "../../utils/constant/cloud.js"
import { ApiFeature } from "../../utils/apiFeatures.js"

// add product
export const addProduct = async(req,res,next)=>{
    // get data from req
    const {
        name,
        description,
        stock ,
        price,
        discount,
        discountType,
        colors,
        sizes,
        category,
        subcategory,
        brand
     } = req.body
    // check existence
    // 1- brand exist
    const brandExist = await Brand.findById(brand)
    if(!brandExist){
        return next (new AppError(messages.brand.notFound,404))
    }
    // 2- subcategory
    const subcategoryExist=await Subcategory.findById(subcategory)
    if(!subcategoryExist){
        return next (new AppError(messages.subcategory.notFound,404))
    }
    
    // upload images

   const {secure_url,public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder: "hti-g2/products/main-images"})
   let mainImage = {secure_url,public_id}
   req.failImages = []
   req.failImages.push({ public_id })
   let subImages = []


   for (const file of req.files.subImages){
    const {secure_url,public_id} = await cloudinary.uploader.upload(file.path,{folder:"hti-g2/products/sub-images"})
    subImages.push({secure_url,public_id})
    req.failImages.push({public_id})
   }
   
  
   // prepare data
   const slug = slugify(name)
   const product = new Product({
    name,
    slug,
    description,
    stock ,
    price,
    discount,
    discountType,
    colors:JSON.parse(colors),
    sizes:JSON.parse(sizes),
    category,
    subcategory,
    brand,
    mainImage,
    subImages,
    createdBy:req.authUser._id,
    updatedBy:req.authUser._id,

   })

   // add to db
   const createdProduct = await product.save()
   if (!createdProduct){
 
    return next (new AppError(messages.product.failToCreate,500))
   }
   // send response
   return res.status(201).json({message:messages.product.createdSuccessfully,
    success:true,
    data:createdProduct
})
}

// get products
// pagination  //sort //search //filter
export const getAllProducts = async (req,res,next) =>{
   // pagination  sort  select  filter
   // let {page, size, sort, select, ...filter} = req.query
   // let filter = JSON.parse(JSON.stringify(req.query))
   // let excludedFields = ['sort', 'select', 'size', 'page']
   // excludedFields.forEach(ele => {
    //    delete filter[ele]
    //})
   // filter = JSON.parse( JSON.stringify(filter).replace(/'gte | gt | lte | lt'/g, match => `$${match}`) )
    /**
     * page   size    data    skip
     *  1       3     1 2 3     0
     *  2       3     4 5 6     3
     *  3       3     7 8 9     6
     */
   // if(!page || page <= 0){
    //    page = 1
   // }
   // if(!size || size <= 0){
    //    size = 3
   // }
    //let skip = (page - 1) * size
    //sort = sort?.replaceAll(',', ' ')
    //select = select?.replaceAll(',', ' ')
    //const products = await Prouduct.find(filter).limit(size).skip(skip).sort(sort).select(select)
    const apiFeature = new ApiFeature(Product.find(), req.query).pagination().sort().select().filter()
    const products = await apiFeature.mongooseQuery
    
    return res.status(200).json({success:true , data:products})
}

// update product
export const updateProduct = async (req,res,next) => {
    // get data from req
    let { name, description, stock, price, discount, discountType, colors, sizes } = req.body
    const { productId } = req.body
    name = name.toLowerCase
    // check existense
    const productExist = await Prouduct.findById(productId)
    if(!productExist){
        return next(new AppError(messages.product.notFound, 404))
    }
    // check name existence
    const nameExist = await Product.findOne({ name })
    if(nameExist){
        return next(new AppError(messages.product.alreadyExist, 409))
    }
    // prepare data
    const slug = slugify(name)
    productExist.name = name
    productExist.slug = slug
    productExist.description = description
    productExist.stock = stock
    productExist.price = price
    productExist.discount = discount
    productExist.discountType = discountType
    productExist.colors = colors
    productExist.sizes = sizes
    // update image
     if(req.file){
        const {secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            public_id: productExist.mainImage.public_id
        })
     }
     if(req.files){
        const {secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            public_id: productExist.subImages.public_id
        })
     }
     // add to db
     const updatedProduct = await productExist.save()//{}, null
     if(!updatedProduct){
        return next(new AppError(messages.product.failToUpdate, 500))
     }
     // send response
     return res.status(200).json({
        message: messages.product.updatedSuccessfully,
        success: true,
        data: updatedProduct
     })



}

// get specific product
export const getSpecificProduct = async (req,res,next) => {
    // get data from req
    const { productId } = req.params
    const getSpecific = await Product.findById(productId)
    return res.status(200).json({success: true, data: getSpecific})
}

// delete product
export const deleteProduct = async (req,res,next) => {
    // get data from req
    const { productId } = req.params
    const deletedProduct = await Product.deleteOne({ _id: productId })
    return res.status(200).json({message: messages.product.deletedSuccessfuly, success: true})
}