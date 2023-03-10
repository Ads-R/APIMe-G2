const express = require('express')
const router = express.Router()
const {getAllActors, getActorById} = require('../controller/actorController')
const {validateUser} = require('../middleware/auth-middleware')

router.route('/')
.get(validateUser, getAllActors)

router.route('/:id')
.get(validateUser, getActorById)


module.exports = router