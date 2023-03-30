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
                ref: 'Movie',
                required: [true, 'Movie Id is required to add movie roles']
            },
            characterName: {
                type: String,
                required: [true, 'Character name is required']
            }
        }]
    }
})

module.exports = mongoose.model('Actor',ActorSchema)