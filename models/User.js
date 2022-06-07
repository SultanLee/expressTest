const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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

//hash
userSchema.pre('save', function (next){
    var user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            });
        });
    } else{
        next()
    }
})

userSchema.methods.comparePassword = function (plainPassword, callBack){
    bcrypt.compare(plainPassword, this.password, function(err,isMatch){
        if(err) return callBack(err)
        callBack(null, isMatch)
    })
}

userSchema.methods.makeToken = function(callBack){
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'sToken')
    user.token = token
    user.save(function(err,user){
        if(err) return callBack(err)
        callBack(null, user)
    })
}

userSchema.statics.findByToken = function(token, callBack) {
    var user = this
    jwt.verify(token, 'sToken', function(err, decoded){
        user.findOne({"_id": decoded, "token" : token}, function (err, user){
            if(err) return callBack(err)
            callBack(null,user)
        })
    })
}

const User = mongoose.model('User', userSchema)
module.exports = { User }