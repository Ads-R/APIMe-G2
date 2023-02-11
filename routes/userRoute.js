const express = require('express')
const router = express.Router()
const {login, logout, getCurrentUser, register} = require('../controller/userController')
const {validateUser} = require('../middleware/auth-middleware')

router.route('/logout').get(logout)
router.route('/userCheck').get(validateUser, getCurrentUser)
router.route('/login').post(login)
router.route('/register').post(register)

module.exports = router