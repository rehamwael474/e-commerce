import { Cart, Product } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"

export const addToCart = async (req,res,next)=>{
    // get data from req
    const {prouductId,quantity} = req.body 
    // check product 
    const productExist = await Product.findById(prouductId)
        if(!productExist){
            return next (new AppError(messages.product.notFound,404))
        }
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