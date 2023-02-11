const express = require('express')
const router = express.Router()
const {getAllMovies, getSingleMovie} = require('../controller/movieController')
const {validateUser, validateAuthorization} = require('../middleware/auth-middleware')

router.route('/').get(validateUser, validateAuthorization("administrator") , getAllMovies)
router.route('/:id').get(validateUser,getSingleMovie)

module.exports = router