const actorModel = require('../models/actorModel')
const movieModel = require('../models/movieModel')
const {NotFoundError, BadRequest} = require('../custom-errors')


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

const addActor = async (req, res) => {
    const {fullName, country, movieRoles} = req.body
    const actor = await actorModel.create({fullName, country, movieRoles})
    res.status(201).json({success:true, msg:'Actor created'})
}

const updateActor = async (req, res) => {
    const {id:actorId} = req.params
    const {fullName, country} = req.body
    const actor = await actorModel.findOneAndUpdate({_id:actorId}, {fullName, country}, {runValidators:true, new:true})
    if(!actor){
        throw new NotFoundError('actor', actorId)
    }
    res.status(200).json({success:true, msg:'Actor updated'})
}

const deleteActor = async (req, res) => {
    const {id:actorId} = req.params
    const actor = await actorModel.findOne({_id:actorId})
    if(!actor){
        throw new NotFoundError('actor', actorId)
    }
    await actor.remove()
    res.status(200).json({success:true, msg:'Actor deleted'})
}

const addMovieRole = async (req, res) => {
    const {id:actorId} = req.params
    const {movieId, characterName} = req.body
    if(!movieId){
        throw new BadRequest(`The movieId is required`)
    }
    const movie = await movieModel.findOne({_id:movieId})
    if(!movie){
        throw new NotFoundError('movie', movieId)
    }
    const actor = await actorModel.findOne({_id:actorId})
    if(!actor){
        throw new NotFoundError('actor', actorId)
    }
    actor.movieRoles.push({movieId:movie._id,characterName})
    await actor.save()
    res.status(200).json({success:true, msg:'Movie Role added to actor'})
}

const removeMovieRole = async (req, res) => {
    const {id:actorId, movieId:mId} = req.params
    const actor = await actorModel.findOne({_id:actorId})
    if(!actor){
        throw new NotFoundError('actor', actorId)
    }
    const movieRoleIndex = actor.movieRoles.findIndex(a => a.movieId == mId)
    if(movieRoleIndex == -1){
        throw new BadRequest(`The movieId ${mId} does not exist on the actor's movie roles`)
    }
    actor.movieRoles.splice(movieRoleIndex, 1)
    await actor.save()
    res.status(200).json({success:true, msg:'Movie Role removed from actor'})
}



module.exports = {getAllActors, getActorById, addActor, updateActor, deleteActor, addMovieRole, removeMovieRole}