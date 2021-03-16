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
const { User } = require("../models/User");
const { Scene } = require("../models/Scene");
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
});

// uploadFilter 정의
const uploadFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // if (ext !== '.jpg' && ext !== '.png') {
    //   return cb(new Error('Only jpg and png is allowed'), false)
    // }
    // console.log("NOT ERROR")
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: uploadFilter,
}).single("file");

//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {
    // console.log("upload");
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
    const {
        gamePlaying: { gameId, sceneIdList },
        gameHistory,
    } = user;
    for (let i = 0; i < gameHistory.length; i++) {
        if (gameHistory[i].gameId && gameHistory[i].gameId.toHexString() === gameId.toHexString()) {
            user.gameHistory[i].sceneIdList = [...sceneIdList];
            user.gamePlaying.sceneIdList = [];
            user.gamePlaying.gameId = null;
            // user.save()
            return;
        }
    }

    user.gameHistory.push({ gameId, sceneIdList: [...sceneIdList] });
    user.gamePlaying.sceneIdList = [];
    user.gamePlaying.gameId = null;
    // user.save()
    return;
};

// 저장된 씬 아이디로 들어감..
// 저장된 씬이 없는 경우 첫 씬
router.get("/gamestart/:id", auth, async (req, res) => {
    const gameId = mongoose.Types.ObjectId(req.params.id);
    const userId = req.user._id;
    try {
        let user = await User.findOne({ _id: userId });

        if (user.gamePlaying.id && gameId.toHexString() === user.gamePlaying.gameId.toHexString()) {
            return res
                .status(200)
                .json({
                    success: true,
                    sceneId: user.gamePlaying.sceneIdList[user.gamePlaying.sceneIdList.length - 1],
                });
        }
        if (user.gamePlaying.gameId) {
            updateHistoryFromPlaying(user);
        }
        const gameHistory = user.gameHistory;
        for (let i = 0; i < gameHistory.length; i++) {
            if (gameHistory[i].gameId && gameHistory[i].gameId.toHexString() === gameId.toHexString()) {
                user.gamePlaying = {
                    gameId: gameId,
                    sceneIdList: gameHistory[i].sceneIdList.slice(0, gameHistory[i].sceneIdList.length),
                };
                user.save();
                return res
                    .status(200)
                    .json({
                        success: true,
                        sceneId: gameHistory[i].sceneIdList[gameHistory[i].sceneIdList.length - 1],
                    });
            }
        }

        try {
            const game = await Game.findOne({ _id: gameId });
            const sceneId = game.first_scene;
            user.gamePlaying = {
                gameId: gameId,
                sceneIdList: [sceneId],
            };
            user.save();
            return res.status(200).json({ success: true, sceneId });
        } catch (err) {
            console.log(err);
            return res.status(200).json({ success: false });
        }
    } catch (err) {
        console.log(err);
        return res.status(200).json({ success: false });
    }
});

const validateScene = async (gamePlaying, sceneId, gameId) => {
    if (gamePlaying.gameId.toHexString() === gameId.toHexString()) {
        const scene = await Scene.findOne({ _id: gamePlaying.sceneIdList[gamePlaying.sceneIdList.length - 1] });
        if (gamePlaying.sceneIdList[gamePlaying.sceneIdList.length - 1].toHexString() === sceneId.toHexString()) {
            return true;
        }
        for (let i = 0; i < scene.nextList.length; i++) {
            if (scene.nextList[i].toHexString() === sceneId.toHexString()) {
                return true;
            }
        }
    }
    return false;
};

router.get("/getnextscene/:gameId/:sceneId", auth, async (req, res) => {
    const userId = req.user._id;
    let { gameId, sceneId } = req.params;
    gameId = mongoose.Types.ObjectId(gameId);
    sceneId = mongoose.Types.ObjectId(sceneId);

    try {
        const user = await User.findOne({ _id: userId });
        try {
            const scene = await Scene.findOne({ _id: sceneId });
            const val = await validateScene(user.gamePlaying, sceneId, gameId);
            if (!val) {
                return res.status(200).json({ success: false });
            }
            if (user.gamePlaying.sceneIdList[user.gamePlaying.sceneIdList.length - 1].toHexString() !== sceneId.toHexString()) {
                user.gamePlaying = {
                    gameId,
                    sceneIdList: [...user.gamePlaying.sceneIdList, sceneId],
                };
            }

            user.save();

            return res
                .status(200)
                .json({
                    success: true,
                    scene,
                    sceneIdList: user.gamePlaying.sceneIdList,
                });
        } catch (err) {
            console.log(err);
            return res.status(200).json({ success: false });
        }
    } catch {
        console.log(err);
        return res.status(200).json({ success: false });
    }
});

router.post("/refreshHistory", auth, async (req, res) => {
    // req.body 에서 인덱스 가지고 오기
    const sceneIndex = req.body.data.sceneIndex;
    // 유저 정보로 gamePlaying 가지고 오기
    const user_id = req.user._id;
    try {
        const user = User.findOne({ _id: user_id });
        let {
            gamePlaying: { sceneIdList },
        } = user;
        // 첫번째 씬으로 돌아가려 할 때 이상해질 수 있음...
        user.gamePlaying.sceneIdList = sceneIdList.slice(0, sceneIndex - 1);
        return res
            .status(200)
            .json({ success: true, sceneIdList: user.gamePlaying.sceneIdList });
    } catch {
        return res.status(200).json({ success: false });
    }
});


router.get("/getSceneInfo/:sceneId", auth, async (req, res) => {
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
});

router.post("/updatescenestatus", auth, async (req, res) => {
    if (!req.user) {
        return res.status(200).json({ success: false, msg: "Not a user" });
    }
    return;
});

router.post("/getgamedetail", (req, res) => {
    Game.findOne({ _id: req.body.gameId })
        .populate("game_creater")
        .exec((err, gameDetail) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, gameDetail });
        });
});

module.exports = router;
