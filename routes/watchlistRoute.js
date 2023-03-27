const express = require('express')
const router = express.Router()
const {getUserWatchList, getAllWatchList, addToWatchList, removeFromWatchList, changeMovieWatchStatus, checkMovieInWatchList} = require('../controller/watchlistController')
const {validateUser, validateAuthorization} = require('../middleware/auth-middleware')

router.route('/')
.get(validateUser, getUserWatchList)

router.route('/all')
.get([validateUser, validateAuthorization("administrator")],getAllWatchList)

router.route('/:id')
.delete(validateUser, removeFromWatchList)
.put(validateUser,addToWatchList)

router.route('/hasWatched/:id')
.put(validateUser, changeMovieWatchStatus)

router.route('/movie/:movieId')
.get(validateUser, checkMovieInWatchList)

module.exports = router