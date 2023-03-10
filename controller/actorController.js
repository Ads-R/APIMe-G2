const actorModel = require('../models/actorModel')
const {NotFoundError} = require('../custom-errors')


const getAllActors = async (req, res) => {
    const actors = await actorModel.aggregate([
        {$project: {_id: '$_id', fullName: '$fullName', totalMovieRoles: { $size: '$movieRoles'}}}
    ])
    res.status(200).json({success:true, actors})
}

const getActorById = async (req, res) => {
    const actorId = req.params.id
    const actor = await actorModel.findOne({_id:actorId}).populate({path: 'movieRoles.movieId', select:'title'})
    if(!actor){
        throw new NotFoundError('actor', actorId)
    }
    res.status(200).json({success:true, actor})
}


module.exports = {getAllActors, getActorById}