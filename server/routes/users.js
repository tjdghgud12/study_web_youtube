const express = require('express')
const router = express.Router();
const { auth } = require('../middleware/auth');
const { User } = require("../models/User");


router.post('/register', (req, res) => {
  //회원가입 정보를 db에 넣는 부분
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

router.post('/login', (req,res)=> {
  //요청된 이메일을 db에서 찾는다.
  User.findOne({ email: req.body.email }, (err, userInfo)=> {
    if(!userInfo){
      return res.json({
        loginSuccess : false,
        massage: "아이디가 일치하지 않음"
      })
    }
    //요청된 이메일이 있을 때 비밀번호가 같은지 확인하다.
    userInfo.comparePassword(req.body.password , (err, isMatch) =>{
      if(!isMatch)
      return res.json({ loginSuccess : false, massage: "비밀번호 틀림"}) 
      
      userInfo.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에?? 쿠키에 보관하든, 로컬스토리지에 하든 어디든 가능.
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})
      })
    })
  })
  //비밀번호 일치 시 토큰을 생성하기.
})

router.get('/auth', auth, (req, res) => {
  //여기 까지 왔다는 것은 미들웨어를 통과했다는 뜻이고 Authentication 이 true라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,    //role이 0이면 false, 0이 아니면 ture
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

router.get('/logout', auth, (req, res)=> {
  User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err,user) => {
    if(err) return res.json({ success: false, err});
    return res.clearCookie('x_auth').status(200).json({
      success: true
    })
  })
})

module.exports = router;