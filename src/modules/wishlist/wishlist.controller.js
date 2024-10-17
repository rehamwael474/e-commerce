import { messages } from "../../utils/constant/messages.js"

// add to wishlist
export const addToWishlist = async(req,res,next)=>{
    
    // get data from
    const {productId} = req.params
    const userId = req.authUser._id
     // add to db
    const userUpdated = await User.findByIdAndUpdate(userId,{ $addToset : {wishList:productId}},{new:true})
        return res.status(200).json({message:'wishlist updated successfully',
            success:true,
        data:userUpdated.wishList})
    }
    

