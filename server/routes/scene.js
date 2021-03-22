const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Scene } = require("../models/Scene");
const { Game } = require("../models/Game");
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

const updatePlayingForFirst = (targetGameId, targetSceneId, user) => {
  const {
    gamePlaying: { gameId, sceneIdList },
    gameHistory,
    isMaking,
  } = user;

  if (user.gamePlaying !== undefined) {
    let i;
    for (i = 0; i < gameHistory.length; i++) {
      if (gameHistory[i].gameId && gameHistory[i].gameId.toHexString() === user.gamePlaying.gameId.toHexString()) {
        user.gameHistory[i].sceneIdList = [...sceneIdList];
        user.gameHistory[i].isMaking = isMaking;
        break;
      }
    }

    if (i === gameHistory.length) {
      user.gameHistory.push({ gameId, sceneIdList: [...sceneIdList], isMaking });
    }
  }

  user.gamePlaying = {
    gameId: targetGameId,
    sceneIdList: [targetSceneId],
    isMaking: true,
  };
  user.save((err) => {
    if (err) return res.json({ success: false, err })
  });
}

router.post('/create', auth, async (req, res) => {
  const userId = req.user._id
  const scene = new Scene({
    gameId: req.body.gameId,
    writer: userId,
    title: req.body.title,
    nextList: [],
    cutList: [],
    isFirst: req.body.isFirst,
    depth: req.body.sceneDepth,
    prevSceneId: req.body.prevSceneId,
  })

  const user = await User.findOne({ _id: userId });
  
  // TODO : 추후 makingGameList 제한 필요
  user.makingGameList.push({ sceneId: scene._id, gameId: req.body.gameId });

  if (req.body.isFirst) {
    updatePlayingForFirst(req.body.gameId, scene._id, user);
  }
  else {
    user.gamePlaying.isMaking = true;
    user.gamePlaying.sceneIdList.push(scene._id);

    // update Playing For First에서 이미 save 있음
    user.save((err) => {
      console.log(err);
      if (err) return res.status(400).json({ success: false, err })
    });
  }
  scene.save((err, scene) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({ success: true, sceneId: scene._id })
  })

})

router.post('/save', auth, async (req, res) => {

  const sceneId = req.body.sceneId;
  const scene = await Scene.findOne({ _id: sceneId });
  const userId = req.user._id;
  const isTmp = req.body.isTmp;

  if (!isTmp) {
    const user = User.findOne({ _id: userId });
    user.gamePlaying.isMaking = false;

    /* 추가 해야할 기능 :
    /* 1. 내가 기여한 게임 
    /* 2. 내가 창조한 게임 */

    const idx = user.makingGameList.findIndex(item => item.sceneId === sceneId);
    if (idx > -1)  user.makingGameList.splice(idx, 1);
    user.save((err)=>{
      if(err) return res.status(400).json({success:false, err})
    });

    scene.status = 1;
  }

  scene.cutList = req.body.cutList;
  for (let i = 0; i < req.body.cutList.length; i++) {
    scene.cutList[i].characterList = [...req.body.cutList[i].characterList];
  }

  scene.save((err, scene) => {
    if (err) return res.json({ success: false, err })
    if (isTmp) return res.status(200).json({ success: true, scene })
  })

  if (!isTmp && scene.isFirst) {
    try {
      const game = await Game.findOne({ _id: scene.gameId });

      if (!game.first_scene) {
        game.first_scene = scene._id;

        game.save((err, game) => {
          if (err) return res.json({ success: false, err })
          return res.status(200).json({ success: true, scene })
        });
      }

    } catch (err) {
      return res.status(400).json({ success: false, err })
    }
  }

  else if (!isTmp) {
    try {
      const prev_scene = await Scene.findOne({ _id: scene.prevSceneId })
      const insertScene = {
        sceneId: scene._id,
        script: scene.title,
      }
      prev_scene.nextList.push(insertScene)
      prev_scene.save((err, prev_scene) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({ success: true, scene })
      });
    }
    catch (err) {
      console.log(err)
      return res.status(400).json({ success: false, err })
    }
  }
})

router.post("/scenedetail", (req, res) => {
  Scene.findOne({ _id: mongoose.Types.ObjectId(req.body.sceneId) }).exec((err, sceneDetail) => {
    if (err) return res.status(400).send(err);
    const lastCut = sceneDetail.cutList[sceneDetail.cutList.length - 1];
    return res.status(200).json({ success: true, lastCut })
  })
})

module.exports = router;
