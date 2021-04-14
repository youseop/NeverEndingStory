const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Scene, CharacterCut } = require("../models/Scene");
const {TreeData} = require("../models/TreeData");
const { Game } = require("../models/Game");
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const { View } = require('../models/View');
const { ThumbsUp } = require('../models/ThumbsUp');

const {sanitize} = require("../lib/sanitize");
const { objCmp } = require('../lib/object');

const MS_PER_HR = 3600000

const getTheme = (category) => {
  let theme;
  switch (category) {
    case "추리":
      theme = "atorney";
      break;
    default:
      theme = "";
      break;
  }
  return theme;
}


const updatePlayingForFirst = (targetGameId, targetSceneId, user) => {
  const {
    gamePlaying: { gameId, sceneIdList, isMaking },
    gameHistory,
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
  const game = await Game.findOne({_id:req.body.gameId}).select("category");
  const theme = getTheme(game.category)
  const scene = new Scene({
    gameId: req.body.gameId,
    writer: userId,
    title: sanitize(req.body.title),
    nextList: [],
    cutList: [],
    isFirst: req.body.isFirst,
    depth: req.body.sceneDepth,
    prevSceneId: req.body.prevSceneId,
    theme
  })

  const user = await User.findOne({ _id: userId });

  // TODO : 추후 makingGameList 제한 필요
  const exp = Date.now() + MS_PER_HR
  // const newExp = new Date(exp)
  // console.log("new Exp !!", newExp)
  user.makingGameList.push({ sceneId: scene._id, gameId: req.body.gameId, exp });

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
    return res.status(200).json({ success: true, sceneId: scene._id, exp: exp })
  })

})

router.post('/save', auth, async (req, res) => {
  const sceneId = mongoose.Types.ObjectId(req.body.sceneId);
  const scene = await Scene.findOne({ _id: sceneId });
  const userId = req.user._id;
  const isTmp = req.body.isTmp;
  const isEnding = req.body.isEnding;
  // isFirst가 아닐떄만 createdAt이랑 확인해서 저장해도 되는 친구인지 확인, 안되는 친구면 삭제하고, 게임플레잉 마지막 녀석 제거, 이전 씬 응답으로 보내줘서, props.history.replace
  const { isFirst, prevSceneId, createdAt } = scene;
  
  if (!isFirst && (Date.now() - createdAt >= MS_PER_HR)) {
    const user = await User.findOne({ _id: userId });
    Scene.deleteOne({ _id: sceneId });
    const playingIdx = user.gamePlaying.sceneIdList.findIndex(item => objCmp(item, sceneId))
    if (playingIdx === user.gamePlaying.sceneIdList.length-1){
      user.gamePlaying.sceneIdList.pop();
    }
    user.gamePlaying.isMaking = false;
    const idx = user.makingGameList.findIndex(item => item.sceneId.toString() === sceneId.toString());
    if (idx > -1) user.makingGameList.splice(idx, 1);
    user.save((err) => {
      if (err) return res.status(400).json({ success: false, err })
    });
    return res.status(200).json({ success: false, msg: 'expired', prevSceneId })
  }

  if (!isTmp) {
    const user = await User.findOne({ _id: userId });
    if (user.gamePlaying) user.gamePlaying.isMaking = false;

    /* 추가 해야할 기능 :
    /* 1. 내가 기여한 게임 
    /* 2. 내가 창조한 게임 */


    const idx = user.makingGameList.findIndex(item => item.sceneId.toString() === sceneId.toString());
    if (idx > -1) user.makingGameList.splice(idx, 1);
    user.save((err) => {
      if (err) return res.status(400).json({ success: false, err })
    });

    scene.status = 1;
    scene.isEnding = isEnding;
  }

  scene.cutList = req.body.cutList;
  for (let i = 0; i < req.body.cutList.length; i++) {
    //...req.body.cutList[i].characterList
    scene.cutList[i].characterList = [];
    for (let j = 0; j < req.body.cutList[i].characterList?.length; j++) {
      const characterCut = new CharacterCut(req.body.cutList[i].characterList[j]);
      scene.cutList[i].characterList.push(characterCut);
    }
    scene.cutList[i].name = sanitize(scene.cutList[i].name);
    scene.cutList[i].script = sanitize(scene.cutList[i].script);
  }

  const view = new View({
    objectId: req.body.sceneId,
    userList: {
      [userId.toString()]: (new Date()).getTime()
    }
  })
  view.save((err) =>{
    if(err) return res.json({success: false, err})
  });

  const thumbsUp = new ThumbsUp({
      objectId: req.body.sceneId,
      userList: {
          [userId]: false
      }
  })
  thumbsUp.save((err) =>{
      if(err) return res.json({success: false, err});
  });

  scene.save((err, scene) => {
    if (err) return res.json({ success: false, err })
    if (isTmp) return res.status(200).json({ success: true, scene })
  })
  if (!isTmp && scene.isFirst) {

    try {
      const game = await Game.findOne({ _id: scene.gameId });
      const user = await User.findOne({ _id: userId });
      if (!game.first_scene) {
        user.contributedSceneList = [
          ...user.contributedSceneList,
          {
          gameId: game._id,
          sceneCnt: 1,
          sceneList: [{
            sceneId: sceneId.toString(),
            depth: 0
          }]
        }]
        user.contributedGameList = [
          ...user.contributedGameList,
          {
          gameId: game._id,
        }]
        user.save((err) => {
          console.log(err);
          if (err) return res.json({ success: false, err })
        }) 

        game.first_scene = scene._id;
        game.contributerList = [{
          userId: userId,
          userSceneCnt: 1,
          sceneIdList: [sceneId.toString()],
          nickname: user.nickname,
        }]
        game.save((err) => {
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
      const game = await Game.findOne({ _id: scene.gameId });
      const user = await User.findOne({ _id: userId });
      let flag = true;
      for (let i=0; i<game.contributerList.length; i++){
        if (game.contributerList[i].userId.toString() === user._id.toString()){
          flag = false;
          game.contributerList[i].sceneIdList.push(scene._id.toString());
          game.contributerList[i].userSceneCnt += 1;
          break;
        }
      }
      if(flag){
        game.contributerList.push({
          userId: user._id,
          userSceneCnt: 1,
          sceneIdList: [scene._id.toString()],
          nickname: user.nickname,
        })
      }
      game.sceneCnt += 1;
      game.save((err) => {
        if (err) return res.json({ success: false, err })
      })

      flag = true;
      for (let i=0; i<user.contributedSceneList.length; i++){
        if (user.contributedSceneList[i].gameId.toString() === game._id.toString()){
          flag = false;
          user.contributedSceneList[i].sceneList.push({
            sceneId: scene._id.toString(),
            depth: scene.depth
          });
          user.contributedSceneList[i].sceneCnt += 1;
          break;
        }
      }
      if(flag){
          user.contributedSceneList.push({
          gameId: game._id,
          title: game.title,
          thumbnail: game.thumbnail,
          description: game.description.substring(0,15),
          sceneCnt: 1,
          sceneList: [{
            sceneId: scene._id.toString(),
            depth: scene.depth
          }]
        })
      }
      user.save((err) => {
        if (err) return res.json({ success: false, err })
      })
      
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


router.delete('/', async (req, res) => {
  //! 첫번째 씬이면, 게임도 지운다.
  try{
    const {gameId, sceneId, userId} = req.body;

    if (req.body.isFirst) {
      Game.deleteOne({ _id: mongoose.Types.ObjectId(gameId) })
        .then(() => "GAME DELETE SUCCESS")
        .catch((err) => {throw "GAME DELETE ERR "})
    }
    //! 껍데기 씬 지우기
    Scene.deleteOne({ _id: mongoose.Types.ObjectId(sceneId) })
      .then(() => "SCENE DELETE SUCCESS")
      .catch((err) => {throw "GAME SCENE ERR "})
    //! user의 makingGameList & gamePlaying - sceneList, isMaking update
    const user = await User.findOne({ _id: userId });
    const idx = user.makingGameList.findIndex(item => item.sceneId.toString() === sceneId)
    if (idx > -1) {
      user.makingGameList.splice(idx, 1);
  }
    else {
      console.log("THERE IS NO MAKING GAME")
    }
    
    // 제작 취소 누르는 시점에서 이미 삭제 됐을 수도 있다. playing first scene`
    
  
    const playingIdx = user.gamePlaying.sceneIdList.findIndex(item=>objCmp(item, sceneId))
    let prevSceneId
    if(user.gamePlaying.isMaking && (playingIdx === user.gamePlaying.sceneIdList.length-1)){
      user.gamePlaying.sceneIdList.splice(playingIdx,1)
      //! 이미 삭제된 녀석의 emptyNum은 올리지 않는다.
      //! + 제작기간 안지난 녀석만 emptyNum 올린다.
      if(req.body.exp - Date.now() > 0){  
        console.log("제작 기간 이내!", req.body.exp - Date.now())
        prevSceneId = user.gamePlaying.sceneIdList[user.gamePlaying.sceneIdList.length - 1]
      }
    }
    user.gamePlaying.isMaking = false;
    user.save((err) => {
      if (err) {
        console.log(err)
        return res.status(400).json({ success: false, err })
      }
      return res.status(200).json({
        success: true,
        //! 이전 씬은 플레잉 리스트의 마지막 녀석이겠구만!!
        prevSceneId:
          req.body.isFirst ?
            null
            :
            prevSceneId,
      })
    });
    //! 이후, 작성중인 사람, 공헌자 목럭에서 삭제하는 로직도 필요하다.
  } catch(err) {
    console.log(err);
    return res.status(400).json({ success: false, err })
  }
})

router.get("/:sceneId", async (req, res) => {
    let { sceneId } = req.params;
    sceneId = mongoose.Types.ObjectId(sceneId);
    try {
        const scene = await Scene.findOne({ _id: sceneId });
        if (scene === null) {
            return res.status(200).json({ success: false });
        }
        return res.status(200).json({ success: true, scene });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }
});

function setTreeData (gameId, userId, sceneId, cutList, parentSceneId ) {
  return ({
    gameId: gameId, 
    userId: userId,  
    sceneId: sceneId, 
    name: "node",
    characterName: cutList[0].name, 
    firstScript: cutList[0].script, 
    isEnding: false,
    parentSceneId: parentSceneId,
    children: []
  })
}

async function setTree (gameId, sceneId, cutList, prevSceneId ,userId) {
  try{
    const newTreeData = new TreeData(setTreeData (gameId, userId, sceneId, cutList, prevSceneId));
    await TreeData.updateOne(
      {gameId: gameId, sceneId: prevSceneId},
      {$push: {children: newTreeData._id.toString()}}
    );
    await newTreeData.save();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false });
  }
}

router.post('/makedummy', async (req, res) => {
  try {
    const {prevSceneId, userId, gameId} = req.body;
    const isFirst = 0;
    const status = 1;
    const isEnding = false;
    const depth = 2; //? default
    const cutList = [];
    for (let i = 0; i < 3; i++) {
      cutList.push({
        cutEffect: 0,
        characterList: [],
        background: "https://i.imgur.com/UwPKBqQ.jpg",
        script: `dummyscript_youseop _${i}`,
        name: `dummyname_youseop _${i}`,
        bgm:{
          name: "",
          music: ""
        },
        sound:{
          name: "",
          music: ""
        }
      })
    } 

    const dumyScene = new Scene({
      gameId: mongoose.Types.ObjectId(gameId),
      writer: mongoose.Types.ObjectId(userId),
      depth: depth,
      sceneTmp: {
        emptyNum: 4,
        certificationList: []
      },
      prevSceneId: mongoose.Types.ObjectId(prevSceneId),
      nextList: [],
      cutList: cutList,
      status: status,
      isFirst: isFirst,
      isEnding: isEnding,
    })
    const sceneId = dumyScene._id.toString()

    setTree (gameId, sceneId, cutList, prevSceneId, userId);

    const view = new View({
      objectId: dumyScene._id,
      userList: {
        [userId]: (new Date()).getTime()
      } 
    })
    view.save((err) =>{
      if(err) return res.json({success: false, err})
    });

    const thumbsUp = new ThumbsUp({
        objectId: dumyScene._id,
        userList: {
            [userId]: false
        }
    })
    await thumbsUp.save();
    await dumyScene.save();

    const prev_scene = await Scene.findOne({ _id: prevSceneId })
    const game = await Game.findOne({ _id: gameId });
    const user = await User.findOne({ _id: userId });
    let flag = true;
    for (let i=0; i<game.contributerList.length; i++){
      if (game.contributerList[i].userId.toString() === userId){
        flag = false;
        game.contributerList[i].sceneIdList.push(sceneId);
        game.contributerList[i].userSceneCnt += 1;
        break;
      }
    }

    if(flag){
      game.contributerList.push({
        userId: user._id,
        userSceneCnt: 1,
        sceneIdList: [sceneId],
        nickname: user.nickname,
      })
    }
    game.sceneCnt += 1;
    game.save((err) => {
      if (err) return res.json({ success: false, err })
    })

    flag = true;
    for (let i=0; i<user.contributedSceneList.length; i++){
      if (user.contributedSceneList[i].gameId.toString() === gameId){
        flag = false;
        user.contributedSceneList[i].sceneList.push({
          sceneId: sceneId,
          depth: 2
        });
        user.contributedSceneList[i].sceneCnt += 1;
        break;
      }
    }

    if(flag){
        user.contributedSceneList.push({
        gameId: game._id,
        title: game.title,
        thumbnail: game.thumbnail,
        description: game.description.substring(0,15),
        sceneCnt: 1,
        sceneList: [{
          sceneId: sceneId,
          depth: 2
        }]
      })
    }
    await user.save();
    const insertScene = {
      sceneId: sceneId,
      script: "",
    }

    prev_scene.nextList.push(insertScene)
    await prev_scene.save();
    return res.status(200).json({ success: true })
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({ success: false, err })
  }
})

module.exports = router;
