const express = require('express')
const router = express.Router()
const {addReview, deleteReview, updateReview, getAllReviews} = require('../controller/reviewController')
const {validateUser, validateAuthorization} = require('../middleware/auth-middleware')

router.route('/')
.get([validateUser, validateAuthorization('administrator')], getAllReviews)
.post(validateUser, addReview)

router.route('/:id')
.delete(validateUser, deleteReview)
.put(validateUser, updateReview)


module.exports = router