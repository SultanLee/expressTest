const express = require('express')
const app = express()
const port = 4000
const moongoose = require('mongoose')
const {User} = require("./models/User")
const bodyParser = require('body-parser')
const config = require('./config/dev')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

moongoose.connect(config.mongoURI)
    .then(()=> console.log('MongoDB Connected'))
    .catch(err=>console.log(err))

app.get('/', (req, res) => res.send('Hellow World'))
app.post('/register', (req, res) =>{
    const user = new User(req.body)
    user.save((err,userInfo)=>{
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success:true
        })
    })
})

app.listen(port,() => console.log(`Example App listening on port ${port}!`))