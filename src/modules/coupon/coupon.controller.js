import { Coupon } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { discountTypes } from "../../utils/constant/enums.js";
import { messages } from "../../utils/constant/messages.js";

export const addCoupon = async (req,res,next) =>{
    // get data from req
    const {code,discountAmount,discountType,toDate,fromDate} = req.body;
    const userId = req.authUser._id;
    // check coupon exist
    const couponExist =await Coupon.findOne({code})
    if(couponExist){
        return next (new AppError(messages.coupon.alreadyExist,409))
    }
    // check if percentage 
    if(discountType == discountTypes.PERCENTAGE && discountAmount > 100){
        return next(new AppError('must be less than 100',400)
        )
    }
    // prepare data
    const coupon = new Coupon({
       code,
       discountAmount,
       discountType,
       toDate,
       fromDate, 
       createdBy: userId,
    })

    // add to db
    const createdCoupon = await coupon.save()
    if(!createdCoupon) {
        return next(new AppError(messages.coupon.failToCreate,500))
    }
    // send response
    return res.status(201).json({message:messages.coupon.createdSuccessfully,
        success: true,
        data: createdCoupon
    })
    
}

// update coupon 
export const updateCoupon = async (req,res,next) => {
    // get data feom req
    const { code, discountAmount, discountType, fromDate, toDate } = req.body
    const { couponId } = req.params
    // check existence
    const couponExist = await Coupon.findById(couponId)//{}, null
    if(!couponExist){
        return next(new AppError(messages.coupon.notFound, 404))
    }
    // prepare data
    couponExist.code = code
    couponExist.discountAmount = discountAmount
    couponExist.discountType = discountType
    couponExist.fromDate = fromDate
    couponExist.toDate = toDate
    // add to db
    const updatedCoupon = await couponExist.save()//{}, null
    if(!couponExist){
        return next(new AppError(messages.coupon.failToUpdate, 500))
    }
    // send response
    return res.status(200).json({
        message: messages.coupon.updatedSuccessfully,
        success: true,
        data: updatedCoupon
    })
}

// get all coupons
export const getAllCoupon = async (req,res,next) => {
    // get data from req
    const { couponId } = req.params
    const getAll = await Coupon.find()
    return res.status(200).json({success: true, data: getAll})
}

// get specific coupon
export const getSpecificCoupon = async (req,res,next) => {
    // get data from req
    const { couponId } =req.params
    const getspecific = await Coupon.findById(couponId)
    return res.status(200).json({success: true, data: getspecific})
}

// delete coupon
export const deleteCoupon = async (req,res,next) => {
    // get data feom req
    const { couponId } = req.params
    const deletedCoupon = await Coupon.deleteOne({ _id: couponId })
    return res.status(200).json({message: messages.coupon.deletedSuccessfuly, success: true})
}