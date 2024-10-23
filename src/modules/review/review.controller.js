import { Product, Review } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"

export const addReview = async(req,res,next) => {
    // get data from req
    const {comment,rate} = req.body
    const {productId} = req.params
    const userId = req.authUser._id

    // check product exist
    const productExist = await Product.findById(productId)
    if(!productExist){
        return next (new AppError(messages.product.notFound,404))
    }

    // todo check if user has any orders on this prouduct
    // prepare data
    // check if review
    const reviewExist = await Review.findOneAndUpdate({user:userId, product:productId},{rate,comment},{new: true})
    let data = reviewExist
    if(!reviewExist){
        const review = new Review({
        user:userId,
        product:productId,
        comment,
        rate,
        isVerified:false // todo true? has any orders
    })
    // add to db
    const createdReview = await review.save()
    if(!createdReview){
        return next (new AppError(messages.review.failToCreate, 500))
    }
    data = createdReview
}   
    // update product rate
    const reviews = await Review.find({product:productId})
    //let finalRate = 0
    // reviews.forEach((review) => {finalRate += review.rate})
    // finalRate = finalRate / reviews.length
    let finalRate = reviews.reduce((acc, cur) => {
        return acc += cur.rate
    },0)
    finalRate /= reviews.length
    await Product.findByIdAndUpdate(productId,{rate:finalRate})
    // send response
    return res.status(201).json({
        message: messages.review.createdSuccessfully,
        successs:true,
        data
    })
}

// delete review
export const deleteReview = async(req,res,next) => {
    const { reviewId } = req.params
    const deletedReview = await Review.deleteOne({ _id: reviewId })
    return res.status(200).json({success: true, data: deletedReview})
}

// get all review
export const getAllReview = async(req,res,next) => {
    const allReviews = await Review.find()
    return res.status(200).json({ success: true, data: allReviews})
}

// get specific review
export const getSpecificReviews = async (req,res,next) => {
    // get data feom req
    const { reviewId } = req.params
    // get specific
    const getSpecific = await Review.findById(reviewId)
    // send response
    return res.status(200).json({data: getSpecific, success: true})
}