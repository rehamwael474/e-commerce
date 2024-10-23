import { Cart, Product } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"


// add to cart
export const addToCart = async (req,res,next)=>{
    // get data from req
    const {prouductId,quantity} = req.body 
    // check product existence
    const productExist = await Product.findById(prouductId)
        if(!productExist){
            return next (new AppError(messages.product.notFound,404))
        }
    // check stock
        if(!productExist.inStock(quantity)){
            return next (new AppError('out of stock',400))
        }
        let data = ''
        const productExistInCart = Cart.findOneAndUpdate(
            {user: req.authUser._id ,
                 "products.productId":prouductId},
                 {"products.$.quantity":quantity},
                 {new:true}
                )
                data = productExistInCart
    /**
     * 1 find cart
     * 2 product [] find product if exist
     * 3 update cart
     * 4 add to cart
      */      
     if(!productExistInCart){
        const addedProduct = await Cart.findByIdAndUpdate({user:req.authUser._id},{
            $push: {products:{prouductId,quantity}}
        },{new:true})
        data = addedProduct
     } 
     // send response
     res.status(200).json({message:"added to cart successfully",success:true,data})
    
} 

// delete cart
export const deleteCart = async (req,res,next) => {
    // get data from params
    const { cartId } = req.params
    const deletedCart = await Cart.deleteOne({ _id: cartId})
    return res.status(200).json({message: messages.cart.deletedSuccessfully, success: true})
}

// get all cart
export const getAllCart = async (req,res,next) => {
    const getAll = await Cart.find()
    return res.status(200).json({success: true, data: getAll})
}

// get specific cart
export const getSpecificCart = async (req,res,next) => {
    // get data from params
    const{ cartId } = req.params
    const getspecific = await Cart.findById(cartId)
    return res.status(200).json({success: true, data: getspecific})
}
