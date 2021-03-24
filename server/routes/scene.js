const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Scene, CharacterCut } = require("../models/Scene");
const { Game } = require("../models/Game");


router.post('/save', async (req, res) => {

  // console.log(req.body)

  const scene = new Scene({
    gameId: req.body.gameId,
    writer: req.body.writer,
    nextList: req.body.nextList,
    cutList: req.body.cutList,
    isFirst: req.body.isFirst,
    depth: req.body.depth
  })

  // object in object , 자동으로 안들어가서 charaterList 직접 삽입
  for (let i = 0; i < req.body.cutList.length; i++) {
    //...req.body.cutList[i].characterList
    scene.cutList[i].characterList = [];
    for (let j = 0; j < req.body.cutList[i].characterList.length; j++) {
      const characterCut = new CharacterCut(req.body.cutList[i].characterList[j]);
      scene.cutList[i].characterList.push(characterCut);
    }
  }
  scene.save((err, scene) => {
    if (err) return res.json({ success: false, err })
    // return res.status(200).json({success: true, scene})
  })

  // Only First Scene
  if (scene.isFirst) {
    try {
      const game = await Game.findOne({ _id: scene.gameId });

      if (!game.first_scene) {
        game.first_scene = scene._id;
        game.save((err, game) => {
          if (err) return res.json({ success: false, err })
          return res.status(200).json({ success: true, scene })
        });
      }
      // else{
      // TODO : 이미 첫번째가 삽입됐는데, 첫 씬인 경우 (== 첫씬을 다 제출하고 뒤로가기)
      // }

    } catch (err) {
      // console.log(err)
      return res.status(400).json({ success: false, err })
    }
  }
  // First가 아닌 scene에 대해서 하는 행위
  else {
    try {
      const prev_scene = await Scene.findOne({ _id: req.body.prevSceneId })
      const insertScene = {
        sceneId: scene._id,
        script: req.body.sceneOption
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
  // console.log(req.body.sceneId)
  Scene.findOne({ _id: mongoose.Types.ObjectId(req.body.sceneId) }).exec((err, sceneDetail) => {
    if (err) return res.status(400).send(err);
    const lastCut = sceneDetail.cutList[sceneDetail.cutList.length - 1];
    return res.status(200).json({ success: true, lastCut })
  })
})

module.exports = router;
