const express = require("express");
const router = express.Router();
const path = require("path");


const {
    Background,
    Character,
    Bgm,
    Sound,
    characterSchema,
} = require("../models/Game_Components");
const { Game } = require("../models/Game");
const mongoose = require("mongoose");
const { auth } = require("../middleware/auth");

const multer = require("multer");
const { User } = require('../models/User');

//?어디에 쓰이는거지
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
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

router.post("/uploadfiles", (req, res) => {
  console.log("upload");
  //비디오를 서버에 저장
  upload(req, res, (err) => {
      if (err) {
          return res.json({ success: false, err });
      }
      return res.json({
          success: true,
          url: res.req.file.path,
          fileName: res.req.file.filename,
      });
  });
});


router.post("/uploadgame", (req, res) => {
  const game = new Game(req.body);
  game.save((err, game) => {
      if (err) return res.json({ success: false, err });

      res.status(200).json({ success: true, game });
  });
});

router.get("/getgames", (req, res) => {
  //game_creater에 Schema.Types.ObjectId라고 써놨는데,
  //populate를 해줘야 그 정보를 채워서 받을 수 있다.
  //안쓰면 그냥 id만 존재함
  Game.find()
      .populate("creator")
      .exec((err, games) => {
          if (err) return res.status(400).send(err);
          res.status(200).json({ success: true, games });
      });
});

router.post("/getgamedetail", (req, res) => {
  Game.findOne({ _id: req.body.gameId }).exec((err, gameDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, gameDetail });
  });
});

router.post("/putBackgroundImg", (req, res) => {
  Game.findOne({ _id: mongoose.Types.ObjectId(req.body.gameId) })
      .populate("creator")
      .exec((err, gameDetail) => {
          if (err) return res.status(400).send(err);

          const background = new Background(req.body.background);
          gameDetail.background.push(background);

          gameDetail.save((err, doc) => {
              if (err) return res.json({ success: false, err });

              return res.status(200).json({ success: true, gameDetail });
          });
      });
});

router.post("/putCharacterImg", (req, res) => {
  Game.findOne({ _id: mongoose.Types.ObjectId(req.body.gameId) })
      .populate("creator")
      .exec((err, gameDetail) => {
          if (err) return res.status(400).send(err);

          const character = new Character(req.body.character);
          gameDetail.character.push(character);

          gameDetail.save((err, doc) => {
              if (err) return res.json({ success: false, err });

              return res.status(200).json({ success: true, gameDetail });
          });
      });
});

router.post("/putBgm", (req, res) => {
  Game.findOne({ _id: mongoose.Types.ObjectId(req.body.gameId) })
      .populate("creator")
      .exec((err, gameDetail) => {
          if (err) return res.status(400).send(err);

          const bgm = new Bgm(req.body.bgm);
          gameDetail.bgm.push(bgm);

          gameDetail.save((err, doc) => {
              if (err) return res.json({ success: false, err });

              return res.status(200).json({ success: true, gameDetail });
          });
      });
});

router.post("/putSound", (req, res) => {
  Game.findOne({ _id: mongoose.Types.ObjectId(req.body.gameId) })
      .populate("creator")
      .exec((err, gameDetail) => {
          if (err) return res.status(400).send(err);

          const sound = new Sound(req.body.sound);
          gameDetail.sound.push(sound);

          gameDetail.save((err, doc) => {
              if (err) return res.json({ success: false, err });

              return res.status(200).json({ success: true, gameDetail });
          });
      });
});

const updateHistoryFromPlaying = (user) => {
  const { gamePlaying: { gameId, sceneIdList }, gameHistory } = user;

  for (let i = 0; i < gameHistory.length; i++) {
    if (gameHistory[i].gameId === gameId)
      user.gameHistory[i].sceneIdList = [...user.gameHistory[i].sceneIdList, ...sceneIdList];
    user.gamePlaying.sceneIdList = [];
    user.gamePlaying.gameId = null;
    user.save();
    return;
  }

  user.gameHistory.push({ gameId, sceneIdList });
  user.gamePlaying.sceneIdList = [];
  user.gamePlaying.gameId = null;
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
      return res.status(200).json({ success: true, sceneId: user.gamePlaying.sceneIdList[-1] });
    }

    updateHistoryFromPlaying();
    const playingList = user.gameHistory;
    for (let i = 0; i < playingList.length(); i++) {
      if (playingList[i].gameId === gameId) {
        user.gamePlaying = {
          gameId: gameId,
          sceneIdList: playingList[i].sceneIdList.length === 1 ? [] : playingList[i].sceneIdList.slice(0, -1)
        }
        return res.status(200).json({ success: true, sceneId: playingList[i].sceneIdList[-1] });
      }
    }

    try {
      const sceneId = await Game.findOne({ _id: gameId }).game_first_scene;
      user.gamePlaying = {
        gameId: gameId,
        sceneIdList: []
      }
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

const validateScene = async (gamePlaying, sceneId, gameId) => {
  if (gamePlaying.gameId === gameId)
  {
    const scene = await Scene.findOne({ _id: gamePlaying.sceneIdList[-1] });
    for (let i = 0; i < 4; i++) {
      if (scene.nextList[i] === sceneId) {
        return true;
      }
    }
  }
  return false;
}

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
    if (!validateScene(user.gamePlaying, sceneId, gameId)) {
      return res.status(200).json({ success: false });
    }
    try {
      const user = await User.findOne({ _id: userId });
      user.gamePlaying = { gameId, sceneIdList: [...user.gamePlaying.sceneIdList, sceneId] };
      user.save();
    }
    catch {
      console.log(err);
      return res.status(200).json({ success: false });
    }
    return res.status(200).json({ success: true, scene, sceneIdList: user.gamePlaying.sceneIdList });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ success: false });
  }
})


router.post('/refreshHistory', auth, async (req, res) => {
  // req.body 에서 인덱스 가지고 오기
  const sceneIndex = req.body.data.sceneIndex;
  // 유저 정보로 gamePlaying 가지고 오기
  const user_id = req.user._id;
  try {
    const user = User.findOne({ _id: user_id });
    let { gamePlaying: { sceneIdList } } = user;
    // 첫번째 씬으로 돌아가려 할 때 이상해질 수 있음...
    user.gamePlaying.sceneIdList = sceneIdList.slice(0, sceneIndex - 1);
    return res.status(200).json({ success: true, sceneIdList: user.gamePlaying.sceneIdList });
  } catch {
    return res.status(200).json({ success: false });
  }
  // gamePlaying 의 sceneIdList를 슬라이스하고 저장
  return;
})


// router.get('/getsceneidlist/:gameId', auth, async (req, res) => {
//   if (!req.user) {
//     return res.status(200).json({ success: false, msg: "Not a user" });
//   }
//   const gameId = mongoose.Types.ObjectId(req.params.gameId);
//   const userId = req.user._id;
//   try {
//     const user = await User.findOne({ _id: userId });
//     updateHistoryFromPlaying()
//       .then(() => {
//         const playingList = user.gameHistory;
//         for (let i = 0; i < playingList.length(); i++) {
//           if (playingList[i].gameId === gameId) {

//             return res.status(200).json({ success: true, sceneId: playingList[i].sceneIdList });
//           }
//           return res.status(200).json({ success: false });
//         }
//       });
//   } catch {
//     console.log(err);
//     return res.status(200).json({ success: false });
//   }
// })

router.get('/getSceneInfo/:sceneId', auth, async (req, res) => {
  if (!req.user) {
    return res.status(200).json({ success: false, msg: "Not a user" });
  }
  sceneId = mongoose.Types.ObjectId(sceneId);
  try {
    const scene = await Scene.findOne({ _id: sceneId });
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

module.exports = router;
