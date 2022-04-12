const express = require('express')
const router = express.Router();

const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

 
router.post('/getLikes', (req, res) => {    
    let variable = {}

    if(req.body.videoId) {
        variable = { videoId: req.body.videoId }
    }else {
        variable = { videoId: req.body.commentId }
    }
    
    Like.find(variable)
        .exec((err, likes) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success: true, likes })
        })
});

router.post('/uplike', (req, res) => {    
    let variable = {}

    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    }else {
        variable = { videoId: req.body.commentId, userId: req.body.userId }
    }
    //like collection 에다가 클릭 정보를 넣음
    
    const like = new Like(variable)

    like.save((err, likeResult) => {
        if(err) return res.status(400).json({ success: false, err })

        //만약에 dislike가 되어 있다면 dislike 1 줄이고 like 올려주기
        Dislike.findOneAndDelete(variable)
            .exec((err, disLikeResult) => { 
                //exec 함수는 쿼리를 실행해주는 함수
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true })
            })
    })
});


router.post('/unlike', (req, res) => {    
    let variable = {}

    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    }else {
        variable = { videoId: req.body.commentId, userId: req.body.userId }
    }
    //like collection 에다가 클릭 정보를 넣음
    Like.findOneAndDelete(variable)
        .exec((err, result) => {
            if(err) return res.status(400).json({ success:false, err })
            res.status(200).json({ success: true })
        })
});

router.post('/getDislikes', (req, res) => {    
    let variable = {}

    if(req.body.videoId) {
        variable = { videoId: req.body.videoId }
    }else {
        variable = { videoId: req.body.commentId }
    }
    
    Dislike.find(variable)
        .exec((err, dislikes) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success: true, dislikes })
        })
});

router.post('/updislike', (req, res) => {    
    let variable = {}

    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    }else {
        variable = { videoId: req.body.commentId, userId: req.body.userId }
    }
    
    const dislike = new Dislike(variable)

    dislike.save((err, likeResult) => {
        if(err) return res.status(400).json({ success: false, err })

        Like.findOneAndDelete(variable)
            .exec((err, disLikeResult) => { 
                //exec 함수는 쿼리를 실행해주는 함수
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true })
            })
    })
});

router.post('/undislike', (req, res) => {    
    let variable = {}

    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    }else {
        variable = { videoId: req.body.commentId, userId: req.body.userId }
    }
    //like collection 에다가 클릭 정보를 넣음
    Dislike.findOneAndDelete(variable)
        .exec((err, result) => {
            if(err) return res.status(400).json({ success:false, err })
            res.status(200).json({ success: true })
        })
});



module.exports = router;