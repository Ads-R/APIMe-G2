const watchListModel = require('../models/watchlistModel')
const movieModel = require('../models/movieModel')
const {NotFoundError, BadRequest} = require('../custom-errors')

const getUserWatchList = async (req, res) => {
    const watchlists = await watchListModel.findOne({user:req.user.id})
    .populate({path: 'movieItems.movieId', select: 'title yearReleased image'})
    res.status(200).json({success:true, watchlists})
}

const getAllWatchList = async (req, res) => {
    const watchlists = await watchListModel.find({})
    res.status(200).json({success:true, watchlists})
}

const addToWatchList = async (req, res) => {
    const movieId = req.params.id
    const movie = await movieModel.findOne({_id:movieId})
    if(!movie){
        throw new NotFoundError('movie', movieId)
    }
    const watchList = await watchListModel.findOne({user:req.user.id})
    const movieExistsInWatchlist = watchList.movieItems.find(a => a.movieId == movieId)
    if(movieExistsInWatchlist){
        throw new BadRequest(`The movie ${movie.title} is already on your watchlist`)
    }
    watchList.movieItems.push({movieId:movie._id})
    await watchList.save()
    res.status(201).json({success:true, msg:'Movie added to watchlist'})
}

const removeFromWatchList = async (req,res) => {
    const movieId = req.params.id
    const watchList = await watchListModel.findOne({user:req.user.id})
    const movieItemIndex = watchList.movieItems.findIndex(a => a.movieId == movieId)
    if(movieItemIndex == -1){
        throw new BadRequest(`The movieId ${movieId} does not exist on your watchlist`)
    }
    watchList.movieItems.splice(movieItemIndex, 1)
    await watchList.save()
    res.status(200).json({success:true, msg:'Movie removed from watchlist'})
}

const changeMovieWatchStatus = async (req, res) =>{
    const movieId = req.params.id
    const watchList = await watchListModel.findOne({user:req.user.id})
    const movieItemIndex = watchList.movieItems.findIndex(a => a.movieId == movieId)
    if(movieItemIndex == -1){
        throw new BadRequest(`The movieId ${movieId} does not exist on your watchlist`)
    }
    const IsAlreadyTrue = watchList.movieItems[movieItemIndex].hasWatched
    if(IsAlreadyTrue){
        throw new BadRequest('The movie status is already marked as WATCHED')
    }
    watchList.movieItems[movieItemIndex].hasWatched = true
    await watchList.save()
    res.status(200).json({success:true, msg:'Movie item status has been updated'})
}

module.exports = {getUserWatchList, getAllWatchList, addToWatchList, removeFromWatchList, changeMovieWatchStatus}