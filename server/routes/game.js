const express = require('express');
const router = express.Router();
const { Game } = require("../models/Game");
const mongoose = require("mongoose");
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
      return cb(res.status(400).end('only mp4 is allowed'), false);
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
    if (err) {
      return res.json({ success: false, err })
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
    if (err) return res.json({ success: false, err })
    // console.log('success in backed')
    // game.game_character.push(new Character({
    //   name: "new character",
    //   image: req.body.game_thumbnail
    // }))
    // console.log('here1')
    // game.save()
    res.status(200).json({ success: true })
  })
})

router.get('/getgames', (req, res) => {
  //game_creater에 Schema.Types.ObjectId라고 써놨는데,
  //populate를 해줘야 그 정보를 채워서 받을 수 있다.
  //안쓰면 그냥 id만 존재함
  Game.find()
    .populate('game_creater')
    .exec((err, games) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, games })
    })
})


router.get('/gamestart/:id', auth, async (req, res) => {

  const scene = {
    cutList: [
      { characterCnt: 1,

        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "사랑해요... 통키씨....",
      },
      { characterCnt: 1,

        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "햝고싶어요...",
      },
      { characterCnt: 1,

        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "나",
        script: "(조금 무서워진다...)",
      },
      { characterCnt: 1,

        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "이런 저라도 사랑해주실 수 있나요?",
      },
      { characterCnt: 1,

        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "당신만은 절 버리지 마세요",
      },
      { characterCnt: 1,

        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "안그러면 죽일거에요",
      },
      { characterCnt: 1,

        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "(눈을 부릅 뜬다...)",
      }
    ],
    nextList: [
      {
        id: 1,
        text: "죽어.."
      },
      {
        id: 2,
        text: "사랑해.."
      },
      {
        id: 3,
        text: "변태.."
      },
      {
        id: 4,
        text: "코로스.."
      },
    ]
  }
  return res.status(200).json({ success: true, scene });

  // 로그인 중인 유저 가지고 오기..
  const gameId = mongoose.Types.ObjectId(req.params.id);
  const userId = req.user._id;

  try {
    const user = await User.findOne({ _id: userId });
    const playingList = user.gameHistory;
    for (let i = 0; i < playingList.length; i++) {
      const playingGame = playingList[i];
      if (playingGame.gameId === gameId) {
        const sceneId = playingGame.sceneId;
        try {
          const scene = await Scene.findOne({ _id: sceneId });
          return res.status(200).json({ success: true, scene });
        } catch (err) {
          console.log(err);
        }
      }
    }

    try {
      const scene = await Game.findOne({ _id: gameId }).game_first_scene;
      return res.status(200).json({ success: true, scene })
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
})

router.get('/getnextscene/:id', auth, async (req, res) => {
  const sceneId = mongoose.Types.ObjectId(req.params.id);
  try {
    const scene = await Scene.findOne({ _id: sceneId });
    return res.status(200).json({ success: true, scene });
  } catch (err) {
    console.log(err);
  }
})

router.post('/updatescenestatus', auth, async (req, res) => {
  if (!req.user) {
    return res.status(200).json({ success: false, msg: "Not a user" });
  }
  return;
})



router.post('/getgamedetail', (req, res) => {
  Game.findOne({ "_id": req.body.gameId })
    .populate('game_creater')
    .exec((err, gameDetail) => {
      if (err) return res.status(400).send(err)
      return res.status(200).json({ success: true, gameDetail })
    })

})

module.exports = router;