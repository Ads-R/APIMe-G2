const auth = require('../functions/auth-functions')
const {Unauthenticated, Forbidden} = require('../custom-errors')

const validateUser = async (req, res, next)=>{
    const {apimeToken} = req.signedCookies
    if(!apimeToken){
        //throw new Error('Authentication Failed. User must login to access the resources')
        throw new Unauthenticated('Authentication Failed. Please login to access the specific resource')
    }
    try{
        const user = auth.isJwtValid(apimeToken)
        req.user = {id:user.id, username:user.username, role:user.role}
        next()
    }
    catch(err){
        //throw new Error('Authentication Failed')
        throw new Unauthenticated('Authentication Failed')
    }

}

const validateAuthorization =  (...roles) => {
    return (req, res, next)=>{
        const userRole = req.user.role
        if(!roles.includes(userRole)){
            throw new Forbidden('User Unauthorized to access this resource')
        }
        next()
    }

}

module.exports = {validateUser, validateAuthorization}