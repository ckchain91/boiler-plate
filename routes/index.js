const express = require('express')
const router = express.Router();
const passport = require('passport');
const { Customer } = require('../Customers');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../Users')
const { body, validationResult } = require('express-validator')

function isLogin(req, res, next){
    if(!req.user){       
        res.redirect('/login')
    }
    next()
}

function isAdmin(req, res, next){
    if(!req.user){       
        res.redirect('/login')
    }
    if(req.user.role==0) res.redirect('/edit')
    next()
}

router.get('/', (req, res) => {
    res.render('index.ejs' ,{user: req.user}) 
})

//회원가입
router.route('/signup')
    .get((req, res, next) => {
        if(req.user){
            res.redirect('/')
        }
        next()
    },(req, res) => {
        res.render('signup.ejs')
    })
    .post(
        (req,res) => {
            const user = new User(req.body)
            user.save((err, doc) => {
                if (err) return res.json({success: false, err})
                return res.status(200).redirect('/')
            })
        }
    )

// 로그인
router.route('/login')
    .get((req, res) => {
        res.render('login.ejs')
    })
    .post(passport.authenticate('local', {
       failureRedirect: '/fail', //회원인증실패하면 /fail로이동
    }), (req,res) => {
        res.redirect('/')
    })
    


// id 중복확인
router.post('/email', (req, res) => {
    User.findOne({ email: req.body.email}, function(err, result){
        if (err) return res.status(500).json({ success: false})
        if(result) return res.status(404).json({ success: false})
        return res.status(200).json({success: true})
    })
})

// password validation
router.post('/password',
    body('password').isLength({ min: 5 }),
    (req, res) => {
    
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    }
    return res.status(200).json({ errors: false});

})

router.get('/logout',function(req, res){
    req.session.destroy(function(){
        req.session;
    });
    res.redirect('/');
});

router.get('/temp',isLogin, function(req, res){
    res.render('template.ejs', {user : req.user})
})



router.get('/manage',isAdmin, (req, res) => {
    User.find({}, function(err, pa_user){
        console.log(req.user)
        res.render('manage.ejs', {user : req.user, pa_user: pa_user})
    })

})




//ppt 다운링크는 Id가 포함이 될수있도록

module.exports = router;