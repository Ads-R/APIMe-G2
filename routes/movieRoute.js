const express = require('express')
const router = express.Router()
const {getAllMovies, getSingleMovie} = require('../controller/movieController')

router.route('/').get(getAllMovies)
router.route('/:id').get(getSingleMovie)

module.exports = router