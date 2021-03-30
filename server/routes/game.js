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
const { Scene, sceneSchema } = require("../models/Scene");
const mongoose = require("mongoose");
const { auth } = require("../middleware/auth");

const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const { objCmp } = require("../lib/object");
const {sanitize} = require("../lib/sanitize")

const { log } = require("winston");
const { View } = require("../models/View");
const { ThumbsUp } = require("../models/ThumbsUp");


AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAcessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
});

let storage;
if (process.env.NODE_ENV === 'production') {
    storage = multerS3({
        s3: new AWS.S3(),
        bucket: 'neverending',
        key(req, file, cb) {
            cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`)
        },
    })
} else {
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/");
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}_${file.originalname}`);
        },
    });
}

// uploadFilter 정의
const uploadFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
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
            console.log(err);
            return res.json({ success: false, err });
        }
        return res.json({
            success: true,
            files: req.files
        });
    });
});

router.post("/uploadgameInfo", (req, res) => {
    Game.findOne({ _id: mongoose.Types.ObjectId(req.body.gameId) })
        .populate("creator")
        .exec((err, gameDetail) => {
            if (err) return res.status(400).send(err);

            gameDetail.creator = req.body.creator
            gameDetail.title = sanitize(req.body.title)
            gameDetail.description = sanitize(req.body.description)
            gameDetail.thumbnail = req.body.thumbnail
            gameDetail.privacy = req.body.privacy
            gameDetail.category = req.body.category
            // gameDetail.writer = req.body.writer


            gameDetail.save((err, doc) => {
                if (err) return res.json({ success: false, err });
            const userId = req.body.creator;
                const view = new View({
                    objectId: req.body.gameId,
                    userList: {
                        [userId]: (new Date()).getTime()
                    }
                })
                const thumbsUp = new ThumbsUp({
                    objectId: req.body.gameId,
                    userList: {
                        [userId]: false
                    }
                })
                thumbsUp.save((err) =>{
                    if(err) return res.json({success: false, err});
        });
                view.save((err, doc) => {
                    if(err) return res.json({success: false, err})
            return  res.status(200).json({success: true, gameDetail})
                })
            });
        });
});

router.post("/uploadgameframe", (req, res) => {
    const game = new Game();
    game.title = sanitize(req.body.title);
    if(req.body.description)
        game.description = sanitize(req.body.description);
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

router.post("/ratio", (req, res) => {
    Game.findOne({ _id: req.body.gameId }).exec((err, gameDetail) => {
        if (err) return res.status(400).send(err);
        const ratio = gameDetail.ratio;
        return res.status(200).json({ success: true, ratio });
    });
});

router.post("/putDB", (req, res) => {
    Game.findOne({ _id: mongoose.Types.ObjectId(req.body.gameId) })
        .populate("creator")
        .exec((err, gameDetail) => {
            if (err) return res.status(400).send(err);

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

router.post("/putCharDB", (req, res) => {
    Game.findOne({ _id: mongoose.Types.ObjectId(req.body.gameId) })
        .populate("creator")
        .exec((err, gameDetail) => {
            if (err) return res.status(400).send(err);

            gameDetail.character = req.body.character;
            for(let i = 0 ; i <gameDetail.character.length;i++){
                gameDetail.character[i].name = sanitize(gameDetail.character[i].name)
                gameDetail.character[i].description = sanitize(gameDetail.character[i].description)
            }

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
        if (gameHistory[i].gameId && objCmp(gameHistory[i].gameId, gameId)) {
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

    // makingList에 지금 게임 아이디가 있는 경우..
    // 유효성 검증 이후 할일 하기. (Date.now보다 큰가?)

    try {
        let user = await User.findOne({ _id: userId });
        let trashSceneId = mongoose.Types.ObjectId(0);
        const idx = user.makingGameList.findIndex(item => objCmp(item.gameId.gameId, gameId))
        if (idx > -1) {
            if (user.makingGameList[idx].exp < Date.now()) {
                trashSceneId = user.makingGameList[idx].sceneId;
                user.makingGameList.splice(idx, 1)
            }
        }

        // 최신 게임 플레이에 해당하는 게임에 들어가려고 하면 그냥 들어감. 
        if (user.gamePlaying.gameId && objCmp(user.gamePlaying.gameId, gameId)) {
            // trashSceneId 플레잉 리스트에서 삭제 -- 삭제 됐으면, 길이 자연스럽게 줄어든다.
            if (objCmp(user.gamePlaying.sceneIdList[user.gamePlaying.sceneIdList.length - 1], trashSceneId)) {
                user.gamePlaying.sceneIdList.pop();
                user.gamePlaying.isMaking = false;
                user.save((err) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({ success: false })
                    }
                });
            }

            return res
                .status(200)
                .json({
                    success: true,
                    sceneId: user.gamePlaying.sceneIdList[user.gamePlaying.sceneIdList.length - 1],
                    isMaking: user.gamePlaying.isMaking,
                });
        }

        // 아니면 게임 플레임 히스토리에 넣기. 
        if (user.gamePlaying.gameId) {
            updateHistoryFromPlaying(user);
        }

        // 히스토리에서 지금 하려는 게임 찾아서 게임 플레잉에 갖고 옴. 
        for (let i = 0; i < user.gameHistory.length; i++) {
            if (user.gameHistory[i].gameId && user.gameHistory[i].gameId.toHexString() === gameId.toHexString()) {

                // trashSceneId, 히스토리 리스트에서 삭제 -- 삭제 됐으면, 길이 자연스럽게 줄어든다.
                if (trashSceneId.toHexString() === user.gameHistory[i].sceneIdList[user.gameHistory[i].sceneIdList.length - 1].toHexString()) {
                    user.gameHistory[i].sceneIdList.splice(user.gameHistory[i].sceneIdList.length - 1, 1)
                    user.gameHistory[i].isMaking = false;

                }

                user.gamePlaying = {
                    gameId: gameId,
                    sceneIdList: user.gameHistory[i].sceneIdList.slice(0, user.gameHistory[i].sceneIdList.length),
                };

                user.save((err) => {
                    if (err) { console.log(err); return res.status(400).json({ success: false }) }
                });
                return res
                    .status(200)
                    .json({
                        success: true,
                        sceneId: user.gameHistory[i].sceneIdList[user.gameHistory[i].sceneIdList.length - 1],
                        isMaking: user.gamePlaying.isMaking,
                    });
            }
        }

        try {
            // 히스토리에 없으면 게임 플레잉에 새로 만들어서 넣음. 
            const game = await Game.findOne({ _id: gameId });
            const sceneId = game.first_scene;
            user.gamePlaying = {
                gameId: gameId,
                sceneIdList: [sceneId],
                isMaking: false,
            };
            user.save();
            return res.status(200).json({ success: true, sceneId, isMaking: user.gamePlaying.isMaking, });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ success: false });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }
});

const validateScene = async (gamePlaying, sceneId, gameId, isMaking) => {
    if (objCmp(gamePlaying.gameId, gameId)) {

        const len = gamePlaying.sceneIdList.length - 1
        const scene = await Scene.findOne({ _id: gamePlaying.sceneIdList[len] });
        console.log(gamePlaying.isMaking);
        if (gamePlaying.isMaking === isMaking && objCmp(gamePlaying.sceneIdList[len], sceneId)) {
            return true;
        }

        for (let i = 0; i < scene.nextList.length; i++) {
            if (objCmp(scene.nextList[i].sceneId, sceneId)) {
                return true;
            }
        }
    }
    return false;
};

router.post("/scene/validate", auth, async (req, res) => {
    const { user, body: {sceneId, gameId, isMaking} } = req;
    console.log(isMaking);
    const val = await validateScene(user.gamePlaying, sceneId, gameId, isMaking);
    if (!val) {
        return res.status(200).json({ success: false });
    }
    return res.status(200).json({ success: true });
})

router.get("/getnextscene/:gameId/:sceneId", auth, async (req, res) => {
    const userId = req.user._id;
    let { gameId, sceneId } = req.params;
    gameId = mongoose.Types.ObjectId(gameId);
    sceneId = mongoose.Types.ObjectId(sceneId);

    try {
        const user = await User.findOne({ _id: userId });
        try {
            const scene = await Scene.findOne({ _id: sceneId });
            const val = await validateScene(user.gamePlaying, sceneId, gameId, false);
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
        if (scene === null) {
            // console.log("??????")
            return res.status(200).json({ success: false });
        }
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
        .populate("creator")
        .exec((err, gameDetail) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, gameDetail });
        });
});

router.post("/rank", async (req, res) => {
    try{
        const gameDetail = await Game.findOne({ _id: req.body.gameId })
        const contributerList = gameDetail.contributerList;
        let totalSceneCnt = 0;
        for (let i=0; i<contributerList.length; i++){
            totalSceneCnt += contributerList[i].userSceneCnt;
        }
        const contributerCnt = contributerList.length;
        contributerList.sort(function (a,b) {
            return a.userSceneCnt < b.userSceneCnt ? 1 : a.userSceneCnt > b.userSceneCnt ? -1: 0;
        });
        const topRank = contributerList.slice(0,5);

        for(let i=0; i<topRank.length; i++){
            const user = await User.findOne({_id: mongoose.Types.ObjectId(topRank[i].userId)})
            topRank[i] = {
                nickname: user.nickname,
                email: user.email,
                image: user.image,
                userId: user._id,
                userSceneCnt: topRank[i].userSceneCnt,
                sceneIdList: topRank[i].sceneIdList
            }
        }
        return res.status(200).json({ 
            success: true, 
            topRank: topRank,
            contributerCnt: contributerCnt,
            totalSceneCnt: totalSceneCnt
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }

})

router.get("/simple-scene-info", auth, async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ success: false, msg: "Not a user" });
    }
    try {
        const sceneList = req.user.gamePlaying.sceneIdList
        let sceneinfo=[]
        for(let i=0; i <sceneList.length; i++){
            const sceneId = mongoose.Types.ObjectId(sceneList[i]);
            const scene = await Scene.findOne({ _id: sceneId });
            sceneinfo.push({
                sceneId : sceneId,
                background : scene.cutList[scene.cutList.length-1].background,
                name : scene.cutList[scene.cutList.length-1].name,
                script : scene.cutList[scene.cutList.length-1].script,
            });
        }
        return res.status(200).json({sceneinfo:sceneinfo})
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }
});

module.exports = router;
