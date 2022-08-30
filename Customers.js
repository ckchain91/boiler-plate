const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        maxlength: 50
    },
    phone: {
        type: String,
        maxlength: 50
    },
    company: {
        type: String,
        maxlength: 50
    },
    password: {
        type: String,
        minlength: 5,
    },
    role: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
    
    
})

//스키마를 랩핑하여 모델을 만든다.
//save하기 전에 작업 관련
customerSchema.pre('save', function(next){
    let user = this;
    if (user.isModified('password')){
    //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        }) 
    } else {
        next()
    }
})


customerSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword 1234567 
    //암호화된 비번 2b$10$TBsjJ3KNJOdnlSsVJv77Ne728FzmVgZGrqUeB2IAL0zNe4atZJ48S
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

customerSchema.methods.generateToken = function(cb){
    //jwt이용 token 생성
    var user = this; //인스턴스
    var token = jwt.sign(user._id.toHexString(),'secretToken')
    // user_id + secretToken = token
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

customerSchema.statics.findByToken = function(token, cb){
    
    var user = this;
    //복호화
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저아이디를 이용해서 유저를 찾은 다음에 
        // 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인.
        user.findOne({ "_id": decoded, "token": token }, function(err, user){
            if (err) return cb(err);
            cb(null, user);
            
        })
    })
}


const Customer = mongoose.model('Customer', customerSchema)

module.exports = { Customer }