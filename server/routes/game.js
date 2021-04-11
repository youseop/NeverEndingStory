const dotenv = require('dotenv');
const express = require("express");
const router = express.Router();
const path = require("path");
dotenv.config();
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
const { check } = require("../middleware/check");

const multer = require("multer");
const multerS3 = require("multer-s3"); 
const AWS = require("aws-sdk");
const { objCmp } = require("../lib/object");
const { sanitize } = require("../lib/sanitize")

const { log } = require("winston");
const { View } = require("../models/View");
const { ThumbsUp, thumbsUpSchema } = require("../models/ThumbsUp");
const { getRank, getDetail, getSpecificDetail } = require('./functions/game');
const { Comment } = require('../models/Comment');
const { Complaint } = require('../models/Complaint');
const { Like } = require('../models/Like');
const { TreeData } = require('../models/TreeData');

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAcessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
});

let storage;
if (process.env.NODE_ENV === 'production') {
    storage = multerS3({
        s3: new AWS.S3(),
        bucket: 'iovar',
        key(req, file, cb) {
            cb(null, `uploads/${Date.now()}${path.basename(file.originalname)}`)
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
                thumbsUp.save((err) => {
                    if (err) return res.json({ success: false, err });
                });
                view.save((err, doc) => {
                    if (err) return res.json({ success: false, err })
                    return res.status(200).json({ success: true, gameDetail })
                })
            });
        });
});

router.post("/uploadgameframe", (req, res) => {
    const game = new Game();
    game.title = sanitize(req.body.title);
    if (req.body.description)
        game.description = sanitize(req.body.description);
    game.category = req.body.category;
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
            for (let i = 0; i < gameDetail.character.length; i++) {
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

    const targetIndex = gameHistory.findIndex((e) => objCmp(e.gameId, gameId))
    if (targetIndex !== -1) {
        user.gameHistory.splice(targetIndex, 1)
    }

    // for (let i = 0; i < gameHistory.length; i++) {
    //     if (gameHistory[i].gameId && objCmp(gameHistory[i].gameId, gameId)) {
    //         user.gameHistory[i].sceneIdList = [...sceneIdList];
    //         user.gamePlaying.sceneIdList = [];
    //         user.gamePlaying.gameId = null;
    //         return;
    //     }
    // }

    user.gameHistory.push({ gameId, sceneIdList: [...sceneIdList] });
    user.gamePlaying.sceneIdList = [];
    user.gamePlaying.gameId = null;
    return;
};

// 저장된 씬 아이디로 들어감..
// 저장된 씬이 없는 경우 첫 씬
router.get("/start/:gameId", check, async (req, res) => {
    const gameId = mongoose.Types.ObjectId(req.params.gameId);
    const isMember = req.isMember;
    // makingList에 지금 게임 아이디가 있는 경우..
    // 유효성 검증 이후 할일 하기. (Date.now보다 큰가?)
    try {
        let user;
        let trashSceneId = mongoose.Types.ObjectId(0);
        if (isMember) {
            user = await User.findOne({ _id: req.user._id });
            const idx = user.makingGameList.findIndex(item => objCmp(item.gameId, gameId))
            if (idx > -1) {
                if (user.makingGameList[idx].exp < Date.now()) {
                    trashSceneId = user.makingGameList[idx].sceneId;
                    user.makingGameList.splice(idx, 1)
                }
            }
        }
        else {
            // could be initialized
            if (!req.session.gamePlaying) {
                req.session.gamePlaying = []
            }
            if (!req.session.gameHistory) {
                req.session.gameHistory = []
            }
            user = req.session
        } 
        // 최신 게임 플레이에 해당하는 게임에 들어가려고 하면 그냥 들어감.
        const {gamePlaying, gameHistory} = user;
        let isPlayed = false;

        if (gamePlaying.gameId && objCmp(gamePlaying.gameId, gameId)) {
            // trashSceneId 플레잉 리스트에서 삭제 -- 삭제 됐으면, 길이 자연스럽게 줄어든다.
            if (isMember && objCmp(user.gamePlaying.sceneIdList[user.gamePlaying.sceneIdList.length - 1], trashSceneId)) {
                //! 이곳에 들어오지 않았다. -- playing 리스트에서 pop된 적이없다.
                //! 시간이 지난 쓰레기들이 남아있었고, 가장 앞에 있던 녀석을 찾았다.
                //! idx가 매칭되지 않아서 playinglist를 pop시키지 못했다.
                user.gamePlaying.sceneIdList.pop();
                user.gamePlaying.isMaking = false;
                user.save((err) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({ success: false })
                    }
                });
            }
            
            if (gamePlaying?.sceneIdList?.length > 1){
                isPlayed = true;
            }

            return res
                .status(200)
                .json({
                    success: true,
                    isPlayed,
                    sceneId: gamePlaying.sceneIdList[gamePlaying.sceneIdList.length - 1],
                    isMaking: gamePlaying.isMaking,
                });
        }
        // 아니면 게임 플레임 히스토리에 넣기. 
        if (gamePlaying.gameId) {
            updateHistoryFromPlaying(user);
        }
        // 히스토리에서 지금 하려는 게임 찾아서 게임 플레잉에 갖고 옴. 
        for (let i = 0; i < gameHistory.length; i++) {
            if (gameHistory[i].gameId && objCmp(gameHistory[i].gameId, gameId)) {
                // trashSceneId, 히스토리 리스트에서 삭제 -- 삭제 됐으면, 길이 자연스럽게 줄어든다.
                if (objCmp(trashSceneId, gameHistory[i].sceneIdList[gameHistory[i].sceneIdList.length - 1])) {
                    gameHistory[i].sceneIdList.splice(gameHistory[i].sceneIdList.length - 1, 1)
                    gameHistory[i].isMaking = false;
                }
                user.gamePlaying = {
                    gameId: gameId,
                    sceneIdList: user.gameHistory[i].sceneIdList.slice(0, user.gameHistory[i].sceneIdList.length),
                    isMaking: user.gameHistory[i].isMaking
                };
                await user.save();
                
                if (user.gamePlaying?.sceneIdList?.length > 1){
                    isPlayed = true;
                }

                return res
                    .status(200)
                    .json({
                        success: true,
                        isPlayed,
                        sceneId: user.gameHistory[i].sceneIdList[user.gameHistory[i].sceneIdList.length - 1],
                        isMaking: user.gamePlaying.isMaking,
                    });
            }
        }
        // 히스토리에 없으면 게임 플레잉에 새로 만들어서 넣음. 
        const game = await Game.findOne({ _id: gameId });
        const sceneId = game.first_scene;
        user.gamePlaying = {
            gameId: gameId,
            sceneIdList: [sceneId],
            isMaking: false,
        };
        if (isMember) {
            await user.save();
        }
        return res.status(200).json({ 
            success: true, 
            sceneId, 
            isPlayed: false,
            isMaking: user.gamePlaying.isMaking, 
        });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }
});

const validateScene = async (gamePlaying, sceneId, gameId, isMaking) => {
    gamePlaying.isMaking = gamePlaying.isMaking || false;   // for non-member
    if (objCmp(gamePlaying.gameId, gameId)) {
        const len = gamePlaying.sceneIdList.length - 1
        const scene = await Scene.findOne({ _id: gamePlaying.sceneIdList[len] });
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

router.post("/scene/validate", check, async (req, res) => {
    const { user, body: { sceneId, gameId, isMaking } } = req;
    const val = await validateScene(user.gamePlaying, sceneId, gameId, isMaking);
    if (!val) {
        return res.status(200).json({ success: false });
    }
    return res.status(200).json({ success: true });
})

router.get("/getnextscene/:gameId/:sceneId", check, async (req, res) => {
    const isMember = req.isMember;
    let { gameId, sceneId } = req.params;
    gameId = mongoose.Types.ObjectId(gameId);
    sceneId = mongoose.Types.ObjectId(sceneId);
    let user;
    try {
        if (isMember) {
            const userId = req.user._id;
            user = await User.findOne({ _id: userId });
        }
        else {
            user = req.session
        }

        const scene = await Scene.findOne({ _id: sceneId }).populate("writer","nickname")
        const nickname = scene.writer.nickname
        scene.writer = scene.writer._id;    // 안하면 react ERR
        if (!scene) {
            throw "noScene"
        } 
        const val = await validateScene(user.gamePlaying, sceneId, gameId, false);
        if (!val) {
            throw "invalid"
        }
        if (!objCmp(user.gamePlaying.sceneIdList[user.gamePlaying.sceneIdList.length - 1], sceneId)) {
            user.gamePlaying = {
                gameId,
                sceneIdList: [...user.gamePlaying.sceneIdList, sceneId],
            };
        }
        if (isMember) {
            user.save();
        }
        return res
            .status(200)
            .json({
                success: true,
                scene,
                sceneIdList: user.gamePlaying.sceneIdList,
                writer : nickname,
            });
    } catch (err) {
        console.log(err);
        let msg;
        switch (err) {
            case 'noScene':
                msg = "해당 씬은 관리자 권한으로 삭제되었습니다."
                break;
            case 'invalid':
                msg = "하나의 ID로는 한 스토리만 즐겨주세요! 한 스토리 내 장면 간 이동은 미니맵을 이용해주세요!"
                break;
            default:
                break;

        }
        return res.status(200).json({ success: false, msg });
    } 
});

router.post("/refreshHistory", check, async (req, res) => {
    // req.body 에서 인덱스 가지고 오기
    const sceneIndex = req.body.data.sceneIndex;
    // 유저 정보로 gamePlaying 가지고 오기
    try {
        let user;
        if (req.isMember) {
            user = await User.findOne({ _id: req.user._id });
        }
        else {
            user = req.session
        }
        let {
            gamePlaying: { sceneIdList },
        } = user;
        // 첫번째 씬으로 돌아가려 할 때 이상해질 수 있음...
        user.gamePlaying.sceneIdList = sceneIdList.slice(0, sceneIndex + 1);
        if (req.isMember) {
            user.save();
        }
        return res
            .status(200)
            .json({ success: true, sceneIdList: user.gamePlaying.sceneIdList });
    } catch {
        return res.status(400).json({ success: false });
    }
});


router.get("/getSceneInfo/:sceneId", async (req, res) => {
    let { sceneId } = req.params;
    sceneId = mongoose.Types.ObjectId(sceneId);
    try {
        const scene = await Scene.findOne({ _id: sceneId });
        const game_createor = await Game.findOne({ _id: scene?.gameId }).select("creator");
        if (scene === null) {
            return res.status(200).json({ success: false });
        }
        return res.status(200).json({ success: true, scene, creator: game_createor.creator });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }
});

router.post("/updatescenestatus", check, async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ success: false, msg: "Not a user" });
    }
    return;
});

router.get("/detail/:gameId", async (req, res) => {
    try{
        const {gameId} = req.params;
        const {gameDetail} = await getDetail(gameId);
        if(!gameDetail){
            return res.status(200).json({ success: true, gameDetail });
        }
        return res.status(200).json({ success: true, gameDetail });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }
}); 

router.get("/rank/:gameId", async (req, res) => {
    try {
        const {topRank, contributerCnt, sceneCnt} = await getRank(req.params.gameId);
        return res.status(200).json({
            success: true,
            topRank: topRank,
            contributerCnt: contributerCnt,
            totalSceneCnt: sceneCnt
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }

})

router.get("/simple-scene-info", check, async (req, res) => {

    try {
        const gamePlaying = req.isMember ? req.user.gamePlaying : req.session.gamePlaying
        const sceneList = gamePlaying.sceneIdList
        let sceneinfo = []
        for (let i = 0; i < sceneList.length; i++) {
            const sceneId = mongoose.Types.ObjectId(sceneList[i]);
            const scene = await Scene.findOne({ _id: sceneId });
            sceneinfo.push({
                sceneId: sceneId,
                background: scene?.cutList[scene.cutList.length - 1]?.background,
                name: scene?.cutList[scene.cutList.length - 1]?.name,
                script: scene?.cutList[scene.cutList.length - 1]?.script,
            });
        }
        return res.status(200).json({ sceneinfo: sceneinfo })
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }
});


router.post("/search-game", async (req, res) => {
    try {
        const game = await Game.find({ title: { $regex: req.body.input, $options: 'm' },first_scene:{$exists:true} },
        ["title", "category", "thumbnail"])
            .sort({ sceneCnt: -1 })
            .limit(10);
        return res.status(200).json({ success: true, games: game });  
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }
});

router.get("/popular-games", (req, res) => {
    Game.find({first_scene:{$exists:true}})
        .sort({ view: -1 })
        .limit(8)
        .exec((err, games) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, games });
        });
});

router.get("/recent-games", check, async (req, res) => {
    let recent_play = req.isMember ? req.user.gameHistory : req.session.gameHistory;
    let now_play = req.isMember ? req.user.gamePlaying : req.session.gamePlaying;
    let games = []

    if (now_play) {
        try {
            const game = await Game.findOne({ _id: now_play.gameId });
            games.push(game)
        } catch (err) {
            console.log(err);
            return res.status(400).json({ success: false });
        }
    }
    if (now_play && recent_play) {
        for (let i = 1; i <= recent_play.length && i <= 5; i++) {
            try {
                if (objCmp(recent_play[recent_play.length - i].gameId, now_play.gameId)) {
                    continue;
                }
                const game = await Game.findOne({ _id: recent_play[recent_play.length - i].gameId });
                games.push(game)
            } catch (err) {
                console.log(err);
                return res.status(400).json({ success: false });
            }
        }
    }
    return res.status(200).send({
        success: true,
        games
    })

})

router.post("/fork", async (req,res) => {
    //! gameId를 받아서, game 을 검색한다.
    const {userId, parentGameId, title, description,category} = req.body
    const parentGame = await Game.findOne({_id:parentGameId})
    const game= new Game();
    game.title = sanitize(title);
    game.description = sanitize(description);
    game.category = category;
    game.parentId = parentGameId;
  

    
    //! game.background - game.character - game.bgm - game.sound 복사
    game.background = parentGame.background
    game.character = parentGame.character;
    game.bgm = parentGame.bgm;
    game.sound = parentGame.sound;

    game.save((err,game) => {
        if(err) return res.json({success: false, err});
        res.status(200).json({success:true, game})
    })
})

router.delete('/:gameId', async (req,res) => {
    try{
        const {gameId} = req.params;
        const {sceneCnt} = await Game.findOne(
            {_id: gameId},
            {_id: 0, sceneCnt: 1}
        );
        if (sceneCnt > 1){
            return res.status(200).json(
            {   success: true, 
                messege: "연재된 이야기 개수가 한 개 이상인 이야기는 삭제할 수 없습니다." 
            });
        }
        Comment.deleteMany( {gameId: gameId} ).exec();
        Complaint.deleteMany( {gameId: gameId} ).exec();
        Like.deleteMany( {gameId: gameId} ).exec();
        Scene.deleteMany( {gameId: gameId} ).exec();
        ThumbsUp.deleteMany( {objectId: gameId} ).exec();
        TreeData.deleteMany( {gameId: gameId} ).exec();
        View.deleteMany( {gameId: gameId} ).exec();
        Game.deleteOne( {_id: gameId} ).exec();
        return res.status(200).json({ success: true, messege: "삭제되었습니다." });
    } catch (err) {
        return res.json({ success: false, err });
    }
})


module.exports = router;