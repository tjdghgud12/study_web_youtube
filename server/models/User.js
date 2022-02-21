const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength:50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
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

userSchema.pre('save', function(next){

    var user = this;
    if(user.isModified('password')){
        //비밀번호 암호화 시킴
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err,)
        cb(null, isMatch)
    })
}


userSchema.methods.generateToken = function(cb) {
    //제이슨웹토큰을 이용해 토큰 생성
    var user = this;

    var token = jwt.sign(user._id.toHexString(), 'jjori')   //토큰은 jjoli + user._id로 만들어진다.

    user.token = token

    user.save( function(err, user) {        //userInfo => user로 변경 필요할 수 있음
        if(err) return cb(err)
        cb(null, user)
    })
}


userSchema.statics.findByToken = function ( token, cb) {
    var user = this;
    //토큰을 디코드한다.    
    jwt.verify(token, 'jjori', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 후에 클라이언트에서 가져온 토큰과 db에 저장된 토큰이 일치하는지 확인
        user.findOne({"_id" : decoded, "token" : token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}



const User = mongoose.model('User', userSchema)

module.exports = { User }