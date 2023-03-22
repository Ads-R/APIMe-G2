const movieModel = require('../models/movieModel')
const reviewModel = require('../models/reviewModel')
const {NotFoundError, BadRequest} = require('../custom-errors')
const {checkOwner} = require('../functions/auth-functions')

const addReview = async (req, res) => {
    const {reviewComment, reviewRating, movie} = req.body
    const movieExists= await movieModel.findOne({_id:movie})
    if(!movieExists){
        throw new NotFoundError('movie', movie)
    }
    const review = await reviewModel.create({reviewComment,reviewRating,movie,user:req.user.id})
    res.status(201).json({success:true, msg:'A new review has been created', review})
}

const deleteReview = async (req, res) => {
    const reviewId = req.params.id
    const review = await reviewModel.findOne({_id:reviewId})
    if(!review){
        throw new NotFoundError('review', reviewId)
    }
    checkOwner(req.user, review.user.toString())
    await review.remove()
    res.status(200).json({success:true, msg:'Review has been deleted'})
}

const updateReview = async (req, res) => {
    const reviewId = req.params.id
    const review = await reviewModel.findOne({_id:reviewId})
    if(!review){
        throw new NotFoundError('review', reviewId)
    }
    checkOwner(req.user, review.user.toString())
    const {reviewComment, reviewRating} = req.body
    review.reviewComment = reviewComment
    review.reviewRating = reviewRating
    await review.save()
    res.status(200).json({success:true, msg:'Review has been updated', review})
}

const getAllReviews = async (req, res) => {
    const reviews = await reviewModel.find({})
    .populate({path: 'user', select: 'username'})
    .populate({path: 'movie', select: 'title'})
    res.status(200).json({success:true, total:reviews.length ,reviews})
}

const getMovieReviews = async (req, res) => {
    const {title} = req.params
    const movie = await movieModel.findOne({title: {$regex: `^${title}$`, $options: 'i'}})
    let reviews = []
    if(movie){
        reviews = await reviewModel.find({movie:movie._id})
    }
    res.status(200).json({success:true, total:reviews.length, reviews})
}

module.exports = {addReview, deleteReview, updateReview, getAllReviews, getMovieReviews}