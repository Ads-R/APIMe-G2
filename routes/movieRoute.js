const express = require('express')
const router = express.Router()
const {getAllMovies, getSingleMovie, uploadMovieImage, addMovie, deleteMovie, updateMovie} = require('../controller/movieController')
const {validateUser, validateAuthorization} = require('../middleware/auth-middleware')

router.route('/')
.get(validateUser, getAllMovies)
.post([validateUser, validateAuthorization("administrator")], addMovie)

router.route('/uploadMovieImage')
.post([validateUser, validateAuthorization("administrator")], uploadMovieImage)

router.route('/:id')
.get(validateUser,getSingleMovie)
.delete([validateUser, validateAuthorization("administrator")],deleteMovie)
.put([validateUser, validateAuthorization("administrator")], updateMovie)


module.exports = router