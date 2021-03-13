const express = require('express');
const router = express.Router();
const { Game } = require("../models/Game");

const { auth } = require("../middleware/auth");

const multer = require("multer");

//?어디에 쓰이는거지
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.mp4') {
      return cb(res.status(400).end('only mp4 is allowed'),false);
    }
    cb(null, true)
  }
});

const upload = multer({ storage: storage }).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
  //비디오를 서버에 저장
  upload(req, res, err => {
    if(err) {
      return res.json({success: false, err})
    }
    return res.json({
      success: true, 
      url: res.req.file.path, 
      fileName: res.req.file.filename
    })
  })
})

const { characterSchema, Character } = require('../models/Game_Components');
const { User } = require('../models/User');

router.post('/uploadgame', (req, res) => {

  const game = new Game(req.body)
  console.log(req.body)
  console.log("here")
  game.save((err, doc) => {
    if(err) return res.json({success: false, err})
    // console.log('success in backed')
    // game.game_character.push(new Character({
    //   name: "new character",
    //   image: req.body.game_thumbnail
    // }))
    // console.log('here1')
    // game.save()
    res.status(200).json({success: true})
  })
})

router.get('/getgames', (req, res) => {
  //game_creater에 Schema.Types.ObjectId라고 써놨는데,
  //populate를 해줘야 그 정보를 채워서 받을 수 있다.
  //안쓰면 그냥 id만 존재함
  Game.find()
    .populate('game_creater')
    .exec((err, games) => {
      if(err) return res.status(400).send(err);
      res.status(200).json({success:true, games})
    })
})


router.get('/getscene', auth, async (req, res) => {
  // 로그인 중인 유저 가지고 오기..
  const user_id = req.user._id;
  // 로그인 중인 유저의 객체 가지고 오기
  const user = await User.findOne({_id: user_id});

  user.

  Game.find()
    .populate('game_creater')
    .exec((err, games) => {
      if(err) return res.status(400).send(err);
      res.status(200).json({success:true, games})
    })
})


router.post('/getgamedetail', (req, res) => {
  Game.findOne({"_id" : req.body.gameId})
    .populate('game_creater')
    .exec((err, gameDetail) => {
      if(err) return res.status(400).send(err)
      return res.status(200).json({success: true, gameDetail})
    })

})

module.exports = router;