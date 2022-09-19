const express = require('express')
//const MongoClient = require('mongodb').MongoClient
const app = express()
const port = 3000
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const indexRouter = require('./routes')
const paRouter = require('./routes/pa')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session')

const mongoose = require('mongoose')
const config = require('./config/key')
const { User } = require('./Users.js')
const { Customer } = require('./Customers.js')

app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(session({ secret : process.env.SECRET_CODE, resave: true, saveUninitialized:false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true})) 
app.set('view engine', 'ejs')

mongoose.connect(config.mongoURI, 
    { dbName: 'phum'
    //     useNewUrlParser: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true
    })
    .then(()=> console.log('MongoDB connected'))
    .catch( (err) => { console.log(err)})

//검증방식
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: true,
    passReqToCallback: false, 
}, (email, password, done) => {
    User.findOne({ email: email}, function(err, result){
        if (err) return done(err)
        if (!result) return done(null, false, { message : '존재하지않는 아이디요'})

        return result.comparePassword(password, (err, isMatch) => {
            if (!isMatch){
                return done(null, false, { message: "doesn't match"})
            }
            return done(null, result, { message: "Success"})
            }
        )
    })
})
)

// 세션 만들어주기
passport.serializeUser(function(user, done){
    done(null, user._id);
});

// 세션 통해 정보가져오기
passport.deserializeUser(function(아이디, done){ //아이디 = user._id
    User.findOne({ _id : 아이디}, function(err, result){
        done(null, result);
    })
});

app.use('/', indexRouter)
app.use('/pa', paRouter)

app.use((req, res, next) => {
    res.status(404).send('Not Found')
})

// 포트 리스닝
app.listen(port, (req, res) => {
    console.log('hello world')
})