const express = require('express')
const app = express()
const port = 4000
const moongoose = require('mongoose')
const {User} = require("./models/User")
const bodyParser = require('body-parser')
const config = require('./config/dev')
const cookieParser = require("cookie-parser")
const {auth} = require('./middleware/auth')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

//mongoDB connect
moongoose.connect(config.mongoURI)
    .then(()=> console.log('MongoDB Connected'))
    .catch(err=>console.log(err))

//user register
app.post('/api/users/register', (req, res) =>{
    const user = new User(req.body)
    user.save((err,userInfo)=>{
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success:true
        })
    })
})

//user login
app.post('/api/users/login', (req, res) =>{
    User.findOne({email: req.body.email}, (err,user) =>{
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "email not found."
            })
        }
        user.comparePassword(req.body.password, (err, isMatch) =>{
            if(!isMatch)
                return res.json({
                    loginSuccess: false,
                    message: "password is wrong."
                })
            user.makeToken((err,user) =>{
                if(err) return res.status(400).send(err);
                res.cookie("auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id
                    })
            })
        })
    })
})

//user auth
app.get('/api/users/auth', auth, (req, res) =>{
    res.status(200).json({
        _id: req.user._id,
        email: req.user.email,
        name: req.user.name
    })
})

//user logout
app.get('/api/users/logout', auth, (req, res) =>{
    User.findOneAndUpdate({_id: req.user._id},
        {token:""},
        (err,user) => {
            if(err) return res.json({
                success : false, err
            })
            return res.status(200).send({
                success:true
            })
        })
})

app.listen(port,() => console.log(`Port : ${port}`))