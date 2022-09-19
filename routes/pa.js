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


router.route('/')
    .get(isLogin, (req, res) => {
    res.redirect('/pa/deal')
    })

router.route('/edit')
    .get(isLogin, (req, res) => {
        res.render('edit.ejs',{user: req.user})
    })
    .put(isLogin, (req, res) => {
        User.updateOne({ _id : req.body.id }, 
            { $set :
                {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    company: req.body.company,
                }
            }, function (err, result) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Updated Docs : ", result);
                res.redirect('/')
            }
        });
    })

// 딜등록 페이지 - 로그인 여부 확인
router.route('/deal')
    .get(isLogin, (req, res) => {
        Customer.find({me: req.user._id}, (err, result) => {
            if(err) res.redirect('/')
            var customer_info = {}
            customer_info['result'] = result
            console.log(customer_info)
            res.render('deal.ejs', {customer: customer_info, user: req.user})
        })
    })
    .post(isLogin,(req,res) => {
        let customer_info = req.body
        customer_info['me'] = req.user._id  
        console.log(customer_info)
        const customer = new Customer(customer_info)
        customer.save((err, doc) => {
            if (err) return res.json({success: false, err})
            return res.status(200).redirect('/pa')
        })
    })

// //딜등록현황 페이지
// router.get('/status',isLogin, (req, res) => {
//     Customer.find({me: req.user._id}, (err, result) => {
//         if(err) res.redirect('/')
//         var customer_info = {}
//         customer_info['result'] = result
//         res.render('status.ejs', {customer: customer_info, user: req.user})
//     })

// })

module.exports = router;