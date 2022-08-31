const express = require('express')
const router = express.Router();
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../Users')

function isLogin(req, res, next){
    if(!req.user){
        res.redirect('/login')
    }
    next()
}

router.get('/', (req, res) => {
    res.render('index.ejs' ,{user: req.user}) 
})

//회원가입
router.route('/signup')
    .get((req, res) => {
        res.render('signup.ejs')
    })
    .post(
        (req,res) => {
            console.log(req.body)
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
    
// 딜등록 페이지 - 로그인 여부 확인
router.route('/deal')
    .get(isLogin, (req, res) => {
        res.render('deal.ejs', { user: req.user }) 
    })
    .post((req,res) => {
        console.log(req.body)
        const customer = new Customer(req.body)
        customer.save((err, doc) => {
            if (err) return res.json({success: false, err})
            return res.status(200).redirect('/')
        })
    })


// id 중복확인
router.post('/email', (req, res) => {
    User.findOne({ email: req.body.email}, function(err, result){
        if (err) return res.status(500).json({ success: false})
        if(result) return res.status(404).json({ success: false})
        return res.status(200).json({success: true})
    })
})



// 마이페이지 -로그인 여부 확인
router.get('/mypage', isLogin ,(req, res)=>{
    console.log(req.user)
   res.render('mypage.ejs',{ user: req.user }) 
})




router.get('/logout',function(req, res){
    req.session.destroy(function(){
        req.session;
    });
    res.redirect('/');
});

router.get('/fail', function(req, res){
    res.render('fail.ejs')
})


router.get('/edit', (req, res) => {
    res.render('edit.ejs',{user: req.user})
})


module.exports = router;