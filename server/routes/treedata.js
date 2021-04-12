const express = require('express');
const router = express.Router();
const { Complaint } = require("../models/Complaint");
const { User } = require("../models/User");
const { check } = require("../middleware/check");

const mongoose = require('mongoose');

const {TreeData} = require("../models/TreeData");
const { Scene } = require('../models/Scene');
const { Game } = require('../models/Game');
const { Comment } = require('../models/Comment');
const { ThumbsUp } = require('../models/ThumbsUp');
const { Like } = require('../models/Like');
const { View } = require('../models/View');


function setTreeData (gameId, userId, sceneId, sceneData, parentSceneId ) {
  return ({
    gameId: gameId, 
    userId: userId,  
    sceneId: sceneId, 
    name: "node",
    characterName: sceneData.cutList[0].name, 
    firstScript: sceneData.cutList[0].script, 
    isEnding: sceneData.isEnding,
    parentSceneId: parentSceneId,
    children: []
  })
}

const deleteData = async (managedData, id) => {
  const data = managedData[id];
  const {sceneId, gameId, userId} = data;
  const gameId = mongoose.Types.ObjectId(gameId);
  const userId = mongoose.Types.ObjectId(userId);
  const comments = await Comment.find(
    {gameId: gameId, responseTo: "", sceneId: sceneId},
    {_id: 1}
  );
  if(comments){
    for (let i=0; i<comments.length; i++ ){
      await Comment.deleteMany({
        gameId: gameId, 
        responseTo: comments[i]._id.toString(), 
        sceneId: sceneId
      })
      await Like.deleteOne({
        userId: userId,
        gameId: gameId,
        commentId: comments[i]._id.toString(),
      })
    }
  }
  await Comment.deleteMany( {gameId: gameId, responseTo: "", sceneId: sceneId} );
  await View.deleteOne({objectId: sceneId});
  await ThumbsUp.deleteOne({objectId: mongoose.Types.ObjectId(sceneId)})
  await TreeData.deleteOne({_id: mongoose.Types.ObjectId(data._id)});
  await Scene.deleteOne({_id: mongoose.Types.ObjectId(sceneId)});
  await User.updateOne(
    { 
      _id:  userId, 
      "contributedSceneList.sceneList.sceneId": sceneId 
    },
    { $pull: { 'contributedSceneList.$.sceneList': { "sceneId": sceneId } } }
  ) //quary reference: https://stackoverflow.com/questions/30167722/how-do-i-remove-an-array-inside-an-array-in-mongodb/30169123
  await User.updateOne(
    { 
      _id:  userId,  
      "contributedSceneList.gameId": gameId 
    },
    { $inc: { 'contributedSceneList.$.sceneCnt': -1} }
  )
  await Game.updateOne(
    { 
      _id:  gameId,  
      "contributerList.userId": userId 
    },
    { $pull: { 'contributerList.$.sceneIdList': sceneId } }
  ) 
  await Game.updateOne(
    { 
      _id:  gameId,  
      "contributerList.userId": userId 
    },
    { $inc: { 'contributerList.$.userSceneCnt': -1} }
  )
  data.children.map((childId) => {
    deleteData(managedData, childId);
  }) 
};

const deleteCnt = (managedData, id) => {
  let cnt = -1;
  const data = managedData[id];
  data.children.map((childId) => {
    cnt += deleteCnt(managedData, childId);
  }) 
  return cnt;
}

router.post('/', check, async (req,res) => {
  let gamePlaying = req.isMember ? req.user.gamePlaying : req.session.gamePlaying;
  if (!req.user) {
    return res.status(400).json({ success: false, msg: "Can't find user" });
  }
  try{
    const gameId = gamePlaying.gameId;
    const sceneList = gamePlaying.sceneIdList;
    const sceneId = sceneList[sceneList.length-1];

    const sceneData = await Scene.findOne(
      { _id: mongoose.Types.ObjectId(sceneId)},
      {cutList:1, isEnding:1, prevSceneId:1, _id:0}
    );

    if (sceneList.length > 1){
      const prevSceneId = sceneList[sceneList.length-2];
      const newTreeData = new TreeData(setTreeData (gameId, req.user._id, sceneId, sceneData, sceneList[sceneList.length-2]));
      await TreeData.updateOne(
        {gameId: gameId, sceneId: prevSceneId},
        {$push: {children: newTreeData._id.toString()}}
        );
      await newTreeData.save();
    } else {
      const newTreeData = new TreeData(setTreeData (gameId, req.user._id, sceneId, sceneData, "rootNode"));
      await Game.updateOne(
        {_id: gameId},
        {first_node: newTreeData._id.toString()}
      )
      await newTreeData.save();
    }
    return res.status(200).json({success: true})
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false });
  }
})


router.get('/:gameId', async (req,res) => {
  try{
    const {gameId} = req.params;
    const rawData = await TreeData.find({gameId: gameId});
    const game = await Game.findOne( {_id: gameId}, {_id: 0, first_node:1} );
    const firstNodeId = game.first_node;
    return res.status(200).json({success: true, rawData, firstNodeId});
  } catch (err) {
    console.log(err)
    return res.json({ success: false, err })
  }
})

router.get('/nodeInfo/:userId/:sceneId/:gameId', async (req,res) => {
  try{
    const { userId, sceneId, gameId } = req.params;
    let sceneUserInfo = await User.findOne(
      {_id: userId}, 
      {
        _id: 0,
        email: 1,
        nickname: 1,
        image: 1,
        contributedSceneList: {$elemMatch: {gameId: gameId }}
      }
    )
    const sceneCutList = await Scene.findOne(
      {_id: sceneId},
      {
        _id: 0,
        cutList: 1
      }
    )
    const gameInfo = await Game.findOne(
      {_id: gameId},
      {
        _id: 0,
        sceneCnt: 1
      }
    )
    const complaints = await Complaint.find({
      gameId: gameId,
      sceneId: sceneId,
    },
    {
      _id: 0,
      title: 1,
      description: 1
    }
    )
    const cutList = sceneCutList.cutList;
    const totalSceneCnt = gameInfo.sceneCnt;
    return res.status(200).json({success: true, sceneUserInfo, cutList, totalSceneCnt, complaints});
  } catch (err) {
    console.log(err);
    return res.json({ success: false, err })
  }
})


router.delete("/:sceneId/:gameId", async (req,res) => {
  try{
    const {sceneId, gameId} = req.params;
    const game = await Game.findOne({_id: gameId}, {_id: 0, first_node: 1});
    const firstNodeId = game.first_node;
    const rawData = await TreeData.find({gameId: gameId});
    const targetNode = await TreeData.findOne({gameId: gameId, sceneId: sceneId},{parentSceneId: 1});
    const targetNodeId = targetNode._id.toString();
    const parentSceneId = targetNode.parentSceneId;

    if(firstNodeId === targetNodeId){
      return res.status(200).json({success: true, messege: "첫 씬은 삭제할 수 없습니다."});
    }

    const {prevSceneId} = await Scene.findOne( 
      {_id: mongoose.Types.ObjectId(sceneId)}, 
      {_id: 0, prevSceneId: 1}
    );

    let data = {};
    for (let i=0; i<rawData.length; i++){
      data = { ...data, [rawData[i]._id]: rawData[i]}
    } 
    const cnt = deleteCnt(data, targetNodeId);
    deleteData(data, targetNodeId);

    await Game.updateOne( 
      {_id: gameId},
      {$inc: {sceneCnt: cnt}}
    ); 
    await Scene.updateOne(
      {_id: prevSceneId},
      {$pull: {nextList: {sceneId: mongoose.Types.ObjectId(sceneId)}}}
    );
    await TreeData.updateOne(
      { gameId: gameId, sceneId: parentSceneId},
      {$pull : {children: targetNodeId}}
    );
    return res.status(200).json({success: true, messege: "성공적으로 삭제되었습니다."});
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, err });
  }
})

module.exports = router;
