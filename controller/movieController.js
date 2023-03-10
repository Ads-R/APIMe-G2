const movieModel = require('../models/movieModel')
const reviewModel = require('../models/reviewModel')
const actorModel = require('../models/actorModel')
const {NotFoundError, BadRequest} = require('../custom-errors')
const {uploadImage} = require('../functions/upload-functions')

const getAllMovies = async (req, res) => {
    //filter - category, title
    //sort - yearReleased, title
    //select - -__v
    const {category, title, sort, page, count} = req.query
    const query = {}
    if(category){
        query.category = category 
    }
    if(title){
        query.title = {$regex: title, $options: 'mi'}
    }

    let moviesQuery = movieModel.find(query)
    if(sort){
        const sortOptions = sort.split(',').join(' ')
        moviesQuery.sort(sortOptions)
    }
    else{
        moviesQuery.sort('title')
    }
    moviesQuery.select('_id title movieRating reviewCount image')

    const pageNumber = Number(page) || 1
    const itemCount = Number(count) || 9
    
    moviesQuery = moviesQuery.skip(itemCount * (pageNumber-1)).limit(itemCount)

    const movies = await moviesQuery;
    const movieCount = await movieModel.countDocuments(query)

    res.status(200).json({success:true, count:movies.length, totalCount: movieCount, movies})
}

const getSingleMovie = async (req, res) => {
    const {id:movieId} = req.params
    const movie = await movieModel.findOne({_id:movieId})
    //.populate('actors')
    
    if(!movie){
        throw new NotFoundError('movie', movieId)
    }
    const reviews = await reviewModel.find({movie:movieId})
    .select('-__v')
    .populate({path: 'user',select: 'username'})

    //const actors = await actorModel.find({'movieRoles.movieId':movieId}).select('fullName')

    const actors = await actorModel.aggregate([
        {$match:{'movieRoles.movieId': movie._id}},
        {$unwind: '$movieRoles'},
        {$match: {'movieRoles.movieId': movie._id}},
        {$group: {_id: '$_id', fullName: {$first: '$fullName'} , movieRoles: {$push: '$movieRoles.characterName'}}}
    ])

    res.status(200).json({success:true, reviewCount:reviews.length, movie, reviews, actors})
}

const uploadMovieImage = async (req, res) => {
    if(!req.files){
        throw new BadRequest('Movie Image is required')
    }

    const movieImage = req.files.movieImage

    if(!movieImage){
        throw new BadRequest('Form field "movieImage" is missing')
    }
    if(!movieImage.mimetype.startsWith('image')){
        throw new BadRequest('An image file format is required')
    }
    if(movieImage.truncated){
        throw new BadRequest('Image is over the size limit of 500kb')
    }

    const imageUrl = await uploadImage(req.files.movieImage)

    res.status(201).json({msg:'Image uploaded successfully', url: imageUrl})
}

const addMovie = async (req, res) => {
    const {title, yearReleased, director, category, image, description} = req.body
    const movieObject = {
        title,yearReleased,director,category,image,description
    }
    await movieModel.create(movieObject)
    res.status(201).json({success:true, msg:'Movie successfully added'})
}

const deleteMovie = async (req, res) => {
    const mId = req.params.id
    const movie = await movieModel.findOne({_id: mId})
    if(!movie){
        throw new NotFoundError('movie', mId)
    }
    await movie.remove()
    res.status(200).send({success:true, msg:'Movie deleted'})
}

const updateMovie = async (req, res) =>{
    const mId = req.params.id
    const movie = await movieModel.findOneAndUpdate({_id: mId}, req.body, {runValidators:true, new:true}).select('-__v')

    if(!movie){
        throw new NotFoundError('movie', mId)
    }
    res.status(200).send({success:true, msg:'Movie Updated', movie})
}

module.exports = {getAllMovies, getSingleMovie, uploadMovieImage, addMovie, deleteMovie, updateMovie}