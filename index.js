const express = require('express')
//const MongoClient = require('mongodb').MongoClient
const app = express()
const port = 3000
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session')

const mongoose = require('mongoose')
const config = require('./config/key')
const { User } = require('./Users.js')
const { Customer } = require('./Customers.js')
console.log(process.env.SECRET_CODE)
app.use(morgan('dev'))
app.use(session({ secret : process.env.SECRET_CODE, resave: true, saveUninitialized:false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true})) 
app.set('view engine', 'ejs')

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

mongoose.connect(config.mongoURI, 
    { dbName: 'phum'
    //     useNewUrlParser: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true
    })
    .then(()=> console.log('MongoDB connected'))
    .catch( (err) => { console.log(err)})



//회원가입
app.get('/signup', (req, res) => {
    return res.render('signup.ejs')
})

app.post('/signup', (req,res) => {
    console.log(req.body)
    const user = new User(req.body)
    user.save((err, doc) => {
        if (err) return res.json({success: false, err})
        return res.status(200).redirect('/')
    })
})

// id 중복확인
app.post('/email', (req, res) => {
    User.findOne({ email: req.body.email}, function(err, result){
        if (err) return res.status(500).json({ success: false})
        if(result) return res.status(404).json({ success: false})
        return res.status(200).json({success: true})
    })
})

// 로그인
app.get('/login', (req, res) => {
    return res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/fail', //회원인증실패하면 /fail로이동
}), (req,res) => {
    res.redirect('/')
})

// function 비밀번호확인(req, res, next){

//     User.findOne({ email: req.body.email }, (err, user) => {
//         if (err) return res.json({
//             loginSuccess : false,
//             message: "오류발생"
//         })
//         if (!user) return res.json({
//             loginSuccess: false,
//             message: "이메일에 해당하는 유저가 없습니다."
//         })
//         //있다면? 비밀번호가 맞는 비밀번호인지 확인?
//         user.comparePassword(req.body.password, (err, isMatch) => {
//             if (!isMatch){
//                 return res.json({
//                     loginSuccess: false,
//                     message: "비밀번호가 틀렸습니다."
//                 })
//             }
            
//             next()
//         })
//     })
   
// }


//검증방식
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: true,
    passReqToCallback: false, 
}, (email, password, done) => {
    console.log(email, password);
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

// 마이페이지 -로그인 여부 확인
app.get('/mypage', isLogin ,(req, res)=>{
    console.log(req.user)
   res.render('mypage.ejs',{ user: req.user }) 
})


// 딜등록 페이지 - 로그인 여부 확인
app.get('/deal', isLogin, (req, res) => {
    res.render('deal.ejs', { user: req.user }) 
})

app.post('/deal', (req,res) => {
    console.log(req.body)
    const customer = new Customer(req.body)
    customer.save((err, doc) => {
        if (err) return res.json({success: false, err})
        return res.status(200).redirect('/')
    })
})

function isLogin(req, res, next){
    if(!req.user){
        res.redirect('/login')
    }
    next()
}


app.get('/', (req, res) => {
    return res.render('index.ejs' ,{user: req.user}) 
})


app.get('/logout',function(req, res){
    req.session.destroy(function(){
        req.session;
    });
    res.redirect('/');
    });

app.get('/fail', function(req, res){
    return res.render('fail.ejs')
})


app.get('/edit', (req, res) => {
    return res.render('edit.ejs',{user: req.user})
})

// 포트 리스닝
app.listen(port, (req, res) => {
    console.log('hello world')
})