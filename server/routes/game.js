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

    // // 여기서 URL에 따라 이름 바꾸고 이미지나 음원은 압축 및 사이즈처리
    // if (ext !== '.jpg' && ext !== '.png') {
    //     console.log("not jpg or png",file)
    //     file.originalname = "바꿔봤찌롱"+ext
    //     return cb(new Error('Only jpg and png is allowed'), false)
    // }
    // console.log("NOT ERROR")
    cb(null, true);
};

const upload = multer({
    fileFilter: uploadFilter,
    storage: storage,
}).array('files')

//=================================
//             Video
//=================================

router.post("/uploadfile", (req, res) => {

    //서버에 저장
    upload(req, res, (err) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({
            success: true,
            files: req.files
        });
    });
});

router.post("/uploadgame", (req, res) => {
    // const game_variables = {
    //     creator: user.userData._id,
    //     title: GameTitle,
    //     description: description,
    //     thumbnail: filePath,
    //     privacy: isPrivate,
    //     category: category,
    //     writer: [user.userData._id],
    //     character: [],
    //     background: [],
    //     bgm: [],
    //     sound: [],
    // };
    Game.findOne({ _id: mongoose.Types.ObjectId(req.body.gameId) })
        .populate("creator")
        .exec((err, gameDetail) => {
            if (err) return res.status(400).send(err);
            gameDetail.save((err, doc) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).json({ success: true, gameDetail });
            });
        });
});

router.post("/uploadgameframe", (req, res) => {
    const game = new Game();
    game.save((err, game) => {
        if (err) return res.json({ success: false, err });

        res.status(200).json({ success: true, game });
    });
});

// router.post("/uploadgamepage", (req, res) => {
//     const game = new Game(req.body);
//     game.save((err, game) => {
//         if (err) return res.json({ success: false, err });

//         res.status(200).json({ success: true, game });
//     });
// });

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

router.post("/putDB", (req, res) => {
    Game.findOne({ _id: mongoose.Types.ObjectId(req.body.gameId) })
        .populate("creator")
        .exec((err, gameDetail) => {
            if (err) return res.status(400).send(err);

            req.body.character.forEach(value => {
                const character = new Character(value);
                gameDetail.character.push(character);
            });
            req.body.background.forEach(value => {
                const background = new Background(value);
                gameDetail.background.push(background);
            });
            req.body.bgm.forEach(value => {
                const bgm = new Bgm(value);
                gameDetail.bgm.push(bgm);
            });
            req.body.sound.forEach(value => {
                const sound = new Sound(value);
                gameDetail.sound.push(sound);
            });

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
            return;
        }
    }

    user.gameHistory.push({ gameId, sceneIdList: [...sceneIdList] });
    user.gamePlaying.sceneIdList = [];
    user.gamePlaying.gameId = null;
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
                user.save((err) => {
                    if (err) { console.log(err); return res.status(400).json({ success: false }) }
                });
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
            return res.status(400).json({ success: false });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }
});

const validateScene = async (gamePlaying, sceneId, gameId) => {
    if (gamePlaying.gameId.toHexString() === gameId.toHexString()) {
        const scene = await Scene.findOne({ _id: gamePlaying.sceneIdList[gamePlaying.sceneIdList.length - 1] });
        if (gamePlaying.sceneIdList[gamePlaying.sceneIdList.length - 1].toHexString() === sceneId.toHexString()) {
            return true;
        }
        for (let i = 0; i < scene.nextList.length; i++) {
            if (scene.nextList[i].sceneId.toHexString() === sceneId.toHexString()) {
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
            return res.status(400).json({ success: false });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }
});

router.post("/refreshHistory", auth, async (req, res) => {
    // req.body 에서 인덱스 가지고 오기
    const sceneIndex = req.body.data.sceneIndex;
    // 유저 정보로 gamePlaying 가지고 오기
    const user_id = req.user._id;
    try {
        const user = await User.findOne({ _id: user_id });

        let {
            gamePlaying: { sceneIdList },
        } = user;
        // 첫번째 씬으로 돌아가려 할 때 이상해질 수 있음...
        user.gamePlaying.sceneIdList = sceneIdList.slice(0, sceneIndex + 1);
        user.save();
        return res
            .status(200)
            .json({ success: true, sceneIdList: user.gamePlaying.sceneIdList });
    } catch {
        return res.status(400).json({ success: false });
    }
});


router.get("/getSceneInfo/:sceneId", auth, async (req, res) => {
    let { sceneId } = req.params;
    if (!req.user) {
        return res.status(400).json({ success: false, msg: "Not a user" });
    }
    sceneId = mongoose.Types.ObjectId(sceneId);
    try {
        const scene = await Scene.findOne({ _id: sceneId });
        return res.status(200).json({ success: true, scene });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }
});

router.post("/updatescenestatus", auth, async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ success: false, msg: "Not a user" });
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
