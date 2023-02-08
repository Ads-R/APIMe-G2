const movieModel = require('../models/movieModel')
const {NotFoundError} = require('../custom-errors')

const getAllMovies = async (req, res) => {
    //filter - category, title
    //sort - yearReleased, title
    //select - -__v
    const {category, title, sort} = req.query
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
    moviesQuery.select('-__v')

    const movies = await moviesQuery;

    res.status(200).json({success:true, movies})
}

const getSingleMovie = async (req, res) => {
    const {id:movieId} = req.params
    const movie = await movieModel.findOne({_id:movieId})
    if(!movie){
        throw new NotFoundError('movie', movieId)
    }
    res.status(200).json({success:true, movie})
}


module.exports = {getAllMovies, getSingleMovie}