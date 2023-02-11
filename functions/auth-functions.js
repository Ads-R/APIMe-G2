const jwt = require('jsonwebtoken')

const sendCookies = (res, token) => {
    res.cookie('apimeToken', token, {expires: new Date(Date.now() + 3600000 * 72), httpOnly: true, signed:true})
}

const isJwtValid = (token) => 
    jwt.verify(token, process.env.TOKEN_SECRET)


module.exports = {sendCookies, isJwtValid}