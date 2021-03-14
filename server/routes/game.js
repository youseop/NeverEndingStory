const express = require('express');
const router = express.Router();
const path = require('path')

const mongoose = require('mongoose');

const {Background,Character,characterSchema} = require("../models/Game_Components");
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
const uploadFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
  if (ext !== '.jpg' && ext !== '.png') {
    return cb(new Error('Only jpg and png is allowed'), false)
    // return cb(res.status(400).end('only jpg and png is allowed') , false)
  }
  console.log("NOT ERROR")
  cb(null, true)
}

const upload = multer({
  storage: storage,
  fileFilter: uploadFilter
}).single("file");

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

const { User } = require('../models/User');

router.post('/uploadgame', (req, res) => {
  const game = new Game(req.body)
  game.save((err, game) => {
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
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, games })
    })
})


const updateHistory = (user) => {
  const { gamePlaying: { gameId, sceneId }, gameHistory } = user;

  for (let i = 0; i < gameHistory.length; i++) {
    if (gameHistory[i].gameId === gameId)
      user.gameHistory[i].sceneId = sceneId;
    user.save();
    return;
  }

  user.gameHistory.push({ gameId, sceneId });
  user.save();
}


router.get('/gamestart/:id', auth, async (req, res) => {
  // 로그인 중인 유저 가지고 오기..
  return res.status(200).json({ success: true, sceneId: 1 });
  const gameId = mongoose.Types.ObjectId(req.params.id);
  const userId = req.user._id;
  try {
    const user = await User.findOne({ _id: userId });

    if (gameId === user.gamePlaying.gameId) {
      return res.status(200).json({ success: true, sceneId: user.gamePlaying.sceneId });
    }

    updateHistory();
    const playingList = user.gameHistory;
    for (let i = 0; i < playingList.length(); i++) {
      if (playingList[i].gameId === gameId) {
        return res.status(200).json({ success: true, sceneId: playingList[i].sceneId });
      }
    }

    try {
      const sceneId = await Game.findOne({ _id: gameId }).game_first_scene;
      return res.status(200).json({ success: true, sceneId })
    } catch (err) {
      console.log(err);
      return res.status(200).json({ success: false });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({ success: false });
  }
})

router.get('/getnextscene/:gameId/:sceneId', auth, async (req, res) => {

  const scene = {
    cutList: [
      {
        characterCnt: 1,

        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "사랑해요... 통키씨....",
      },
      {
        characterCnt: 1,

        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "햝고싶어요...",
      },
      {
        characterCnt: 1,

        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "나",
        script: "(조금 무서워진다...)",
      },
      {
        characterCnt: 1,

        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "이런 저라도 사랑해주실 수 있나요?",
      },
      {
        characterCnt: 1,

        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "당신만은 절 버리지 마세요",
      },
      {
        characterCnt: 1,

        background: "/back1.png",
        characterList: ["/iu.png"],
        name: "IU",
        script: "안그러면 죽일거에요",
      },
      {
        characterCnt: 1,

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
        text: null
      },
    ]
  }
  return res.status(200).json({ success: true, scene });

  const userId = req.user._id;
  const { gameId, sceneId } = req.params;
  gameId = mongoose.Types.ObjectId(gameId);
  sceneId = mongoose.Types.ObjectId(sceneId);
  try {
    const scene = await Scene.findOne({ _id: sceneId });
    try {
      const user = await User.findOne({ _id: userId });
      user.gamePlaying = { gameId, sceneId };
      user.save();
    }
    catch {
      console.log(err);
      return res.status(200).json({ success: false });
    }
    return res.status(200).json({ success: true, scene });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ success: false });
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

// gameId, background
router.post('/putBackgroundImg', (req,res) => {
  Game.findOne({"_id" : mongoose.Types.ObjectId(req.body.gameId)})
    .populate('creator')
    .exec((err, gameDetail) => {
      if(err) return res.status(400).send(err)

      const background = new Background(req.body.background);
      gameDetail.background.push(background);

      gameDetail.save((err, doc) => {
        if(err) return res.json({success: false, err})
        
        return res.status(200).json({success: true, gameDetail})
      })
    })
})

router.post('/putCharacterImg', (req,res) => {
  Game.findOne({"_id" : mongoose.Types.ObjectId(req.body.gameId)})
    .populate('creator')
    .exec((err, gameDetail) => {
      if(err) return res.status(400).send(err)

      const character = new Character(req.body.character);
      gameDetail.character.push(character);

      gameDetail.save((err, doc) => {
        if(err) return res.json({success: false, err})
        
        return res.status(200).json({success: true, gameDetail})
      })
    })
})

module.exports = router;