const express = require('express');
const router = express.Router();
const path = require('path')

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
  }
});

// uploadFilter 정의
const uploadFilter = (req,file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
  if(ext !== '.jpg' && ext !== '.png'){
      return  cb(new Error('Only jpg and png is allowed'),false)
      // return cb(res.status(400).end('only jpg and png is allowed') , false)
  }
  console.log ("NOT ERROR")
  cb(null, true)
}

const upload = multer({ storage: storage,
                        fileFilter : uploadFilter }).single("file");

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

router.post('/uploadgame', (req, res) => {
  const game = new Game(req.body)
  game.save((err, game) => {
    // console.log(err)
    if(err) return res.json({success: false, err})

    res.status(200).json({success: true, game})
  })
})

router.get('/getgames', (req, res) => {
  //game_creater에 Schema.Types.ObjectId라고 써놨는데,
  //populate를 해줘야 그 정보를 채워서 받을 수 있다.
  //안쓰면 그냥 id만 존재함
  Game.find()
    .populate('creator')
    .exec((err, games) => {
      if(err) return res.status(400).send(err);
      res.status(200).json({success:true, games})
    })
})

router.post('/getgamedetail', (req, res) => {
  Game.findOne({"_id" : req.body.gameId})
    .populate('creator')
    .exec((err, gameDetail) => {
      if(err) return res.status(400).send(err)
      return res.status(200).json({success: true, gameDetail})
    })

})

module.exports = router;