const userModel = require('../models/userModel')
const watchListModel = require('../models/watchlistModel')
const {sendCookies} = require('../functions/auth-functions')
const {Unauthenticated, BadRequest} = require('../custom-errors')

const login = async (req, res) => {
    const {username, password} = req.body
    if(!username || !password){
        throw new BadRequest('Username and Password are required')
    }
    const user = await userModel.findOne({username})
    if(!user){
        throw new Unauthenticated('Invalid Username or Password')
    }
    const isValid = await user.validatePassword(password)
    if(!isValid){
        throw new Unauthenticated('Invalid Username or Password')
    }
    const token = user.generateToken()
    sendCookies(res, token)
    res.status(200).json({success:true, msg:'Login Successful', user:{id:user._id, username:user.username,role:user.role}})
}

const logout = async (req, res) => {
    res.cookie('apimeToken', '', {expires: new Date(Date.now())})
    res.status(200).json({success:true, msg:'Logout Successful', httpOnly:true})
}

const getCurrentUser = async (req, res) => {
    res.status(200).json({success:true, user:req.user})
}

const register = async (req, res) => {
    const {username, password} = req.body
    const userExists = await userModel.findOne({username})
    if(userExists){
        throw new BadRequest('Duplicate username')
    }
    const user = await userModel.create({username, password})
    await watchListModel.create({user: user._id})

    res.status(201).json({success:true, msg:'User created'})
}


module.exports = {login, logout, getCurrentUser, register}