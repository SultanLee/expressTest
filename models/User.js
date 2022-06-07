const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 40
    },
    email:{
        type:String,
        unique:1
    },
    password:{
        type:String,
        minLength:1
    },
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
})

const User = mongoose.model('User', userSchema)
module.exports = { User }