const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
    title: {
        type:String,
        required: [true, 'Movie title is required'],
        trim: true,
        maxlength: [100, 'Maximum length of title is 100']
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
        //to force value to undefined instead of the default empty array [] to make the required validation work
        default:undefined
    },
    image: {
        type:String,
        default: '/images/default.jpeg'
    },
    description: {
        type:String,
        required: [true, 'A movie description is required'],
        maxlength: [500, 'Maximum length of description is 500']
    },
    movieRating: {
        type:Number,
        default:0
    },
    reviewCount: {
        type:Number,
        default:0
    }
})

MovieSchema.pre('remove', async function(){
    await this.model('Review').deleteMany({movie:this._id})
})

module.exports = mongoose.model('Movie', MovieSchema)