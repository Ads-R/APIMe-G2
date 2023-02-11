const userModel = require('../models/userModel')
const {sendCookies} = require('../functions/auth-functions')

const login = async (req, res) => {
    const {username, password} = req.body
    if(!username || !password){
        throw new Error('Username and Password are required')
    }
    const user = await userModel.findOne({username})
    if(!user){
        throw new Error('Invalid Username or Password')
    }
    const isValid = await user.validatePassword(password)
    if(!isValid){
        throw new Error('Invalid Username or Password')
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
        throw new Error('Duplicate username')
    }
    await userModel.create({username, password})

    res.status(201).json({success:true, msg:'User created'})
}


module.exports = {login, logout, getCurrentUser, register}