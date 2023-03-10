const mongoose = require('mongoose')

const ActorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Actor name is required']
    },
    country: {
        type: String,
        required: [true, 'Actor country is required']
    },
    movieRoles: {
        type: [{
            movieId: {
                type: mongoose.Types.ObjectId,
                ref: 'Movie'
            },
            characterName: {
                type: String
            }
        }]
    }
})

module.exports = mongoose.model('Actor',ActorSchema)