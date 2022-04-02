const express = require('express')
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Video } = require("../models/Video");
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');
const { Subscriber } = require('../models/Subscriber')

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const uplaod = multer({storage: storage}).single("file");

router.post('/uploadfiles', (req, res) => {
    // 비디오를 서버에 저장.
    uplaod(req, res, err => {
        if(err) {   return res.json({ success: false, err}) }

        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename})
    })
})

router.post('/uploadvideo', (req, res) => {
    // 비디오를 DB에 저장.
    const video = new Video(req.body)

    video.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({success: true })
    })
    
})

router.get('/getVideos', (req, res) => {
    // 비디오를 DB에서 가져와서 클라이언트에게 보내는 곳
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })
    
})


router.post('/thumbnail', (req, res) => {
    // 썸네일 생성하고 비디오 러닝타임도 가져오기
    let fileDuration = ""
    let filePath = ""
    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });
    //썸네일 생성
    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            console.log('Will generate' + filenames.join(', '))
            console.log(filenames)

            filePath = "uploads/thumbnails/" + filenames[0]
        })
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({ 
                success: true, 
                url: filePath, 
                fileDuration: fileDuration
            })
        })
        .on('error', function (err) {
            console.log(err);
            return res.json({ success: false, err })
        })
        .screenshots({
            count: 3,
            folder: 'uploads/thumbnails',
            size: '340x240',
            filename: 'thumbnail-%b.png'
        })
    
    
})


router.post('/getVideoDetail', (req, res) => {
    //비디오 정보 보내기
    Video.findOne({ "_id":req.body.videoId })
        .populate('writer')
        .exec((err, videoDetail) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({ success: true, videoDetail })
        })
})


router.post('/getSubscriptionVideos', (req, res) => {
    // 1. 내가 구독중인 사람을 찾는다. => 내 ID를 가지고 서칭
    // 2. 내가 구독중인 사람들의 영상을 가지고온다.

    //stap 1
    Subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subscriberInfo)  => {
            if(err) return res.status(400).send(err);

            let subscribedUser = [];

            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo)
                console.log(subscriber)
            })

            //stap 2
            //$in => 몽고디비용 메소드임.
            //한명의 writer만 찾는게 아니라, 내가 구독한 모든 writer의 정보를 찾아야 하기 때문에 기존방식 사용 불가
            //$in => 이걸 사용해서 여러명의 writer를 한번에 검색
            Video.find({ writer: { $in: subscribedUser } })
                .populate('writer')
                .exec((err, videos) => {
                    if(err) return res.status(400).send(err);
                    return res.status(200).json({ success: true, videos })
                })
        })
})

module.exports = router;