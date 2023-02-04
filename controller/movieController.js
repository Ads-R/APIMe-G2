const movieModel = require('../models/movieModel')
const os = require('os')

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

    const tempMovies = await moviesQuery;
    const movies = await tempMovies.map((m) =>{
        m.image = `http://${req.hostname}:${process.env.PORT}/images/`+m.image
        return m
    })

    res.status(200).json({movies})
}

const getSingleMovie = async (req, res) => {
    const movie = await movieModel.findOne({id:req.id})
    res.status(200).json({movie})
}


module.exports = {getAllMovies, getSingleMovie}