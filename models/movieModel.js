const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
    title: {
        type:String,
        required: [true, 'Movie title is required']
    },
    yearReleased: {
        type:Number,
        required: [true, 'Movie year released is required']
    },
    director: {
        type:String,
        required: [true, 'Movie director is required']
    },
    category: {
        type:[String],
        enum:['Action', 'Adventure', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-fi', 'Thriller'],
        required: [true, 'At least one category must be selected'],
        default:undefined
    },
    image: {
        type:String,
        default: '/images/default.jpeg'
    },
})

module.exports = mongoose.model('Movie', MovieSchema)