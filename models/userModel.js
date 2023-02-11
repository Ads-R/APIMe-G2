const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required: [true, 'Username is required'],
        minlength: 5
    },
    password:{
        type:String,
        required: [true, 'Password is required'],
        minlength: 8
    },
    role:{
        type:String,
        enum:['administrator','user'],
        default: 'user'
    },
    dateCreated:{
        type:Date,
        default: Date.now()
    }
})


UserSchema.pre('save', async function(){
    const salt = await bcryptjs.genSalt(8)
    this.password = await bcryptjs.hash(this.password, salt)
})

UserSchema.methods.validatePassword = async function(pass){
    const isValid = await bcryptjs.compare(pass, this.password)
    return isValid
}

UserSchema.methods.generateToken = function(){
    const token = jwt.sign({id:this._id, username:this.username, role:this.role}, process.env.TOKEN_SECRET,{
        expiresIn:process.env.TOKEN_LIFETIME
    })
    return token
}

module.exports = mongoose.model('User', UserSchema)