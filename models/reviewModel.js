const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    reviewComment:{
        type: String,
        required: [true, 'Review comment is required'],
        trim: true,
        maxlength: 250
    },
    reviewRating: {
        type: Number,
        max: [5, 'Maximum rating allowed is 5'],
        min: [1, 'Minimum rating allowed is 1'],
        required: [true, 'Review rating is required']
    },
    movie: {
        type: mongoose.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true})
//compound index of movie and user to only allow a user 1 review per product
ReviewSchema.index({movie:1, user:1}, {unique: true})
//update movie rating and review count on create or update of a review
ReviewSchema.post('save', async function(){
    await this.constructor.updateMovieProperties(this.movie)
})
//update movie rating and review count on remove of a review
ReviewSchema.post('remove', async function(){
    await this.constructor.updateMovieProperties(this.movie)
})

ReviewSchema.statics.updateMovieProperties = async function(movieId){
    const aggregation = await this.aggregate([
        {$match:{movie:movieId}},
        {$group:{_id:null,movieRating:{$avg:'$reviewRating'},reviewCount:{$sum:1}}}
    ])
    try{
        await this.model('Movie').findOneAndUpdate({_id:movieId}, {movieRating:parseFloat(aggregation[0]?.movieRating || 0).toFixed(2), reviewCount: aggregation[0]?.reviewCount || 0})
    }
    catch(err){

    }
}

module.exports = mongoose.model('Review',ReviewSchema)