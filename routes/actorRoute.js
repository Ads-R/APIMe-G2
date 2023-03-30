const express = require('express')
const router = express.Router()
const {getAllActors, getActorById, addActor, updateActor, deleteActor, addMovieRole, removeMovieRole} = require('../controller/actorController')
const {validateUser, validateAuthorization} = require('../middleware/auth-middleware')

router.route('/')
.get(validateUser, getAllActors)
.post([validateUser, validateAuthorization("administrator")], addActor)

router.route('/:id')
.get(validateUser, getActorById)
.put([validateUser, validateAuthorization("administrator")], updateActor)
.delete([validateUser, validateAuthorization("administrator")], deleteActor)

router.route('/addRole/:id')
.put([validateUser, validateAuthorization("administrator")], addMovieRole)

router.route('/removeRole/:id/movie/:movieId')
.delete([validateUser, validateAuthorization("administrator")], removeMovieRole)

module.exports = router