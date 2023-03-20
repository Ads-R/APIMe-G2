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
        required: [true, 'Movie year released is required'],
        validate: {
            validator: validateYear,
            message: 'Year Released must not be greater than the current year and not less than the year 1895'
        }
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
}, /*{toJSON:{virtuals:true}, toObject:{virtuals:true}}*/)

//Commented out, incase I changed my mind and want to use virtuals + populate instead of aggregation

// MovieSchema.virtual('actors', {
//     ref:'Actor',
//     localField:'_id',
//     foreignField:'movieRoles.movieId',
//     justOne:false
// })

MovieSchema.pre('remove', async function(){
    await this.model('Review').deleteMany({movie:this._id})
})

function validateYear(year){
    const currentYear = new Date().getFullYear()
    const firstMovie = 1895
    return year <= currentYear && year >= 1895
}

module.exports = mongoose.model('Movie', MovieSchema)