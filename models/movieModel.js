const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
    title: String,
    yearReleased: Number,
    director: String,
    category: String,
    image: String,
})

module.exports = mongoose.model('Movie', MovieSchema)