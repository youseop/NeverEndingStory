const express = require('express');
const router = express.Router();
import { of, forkJoin, Observable } from "rxjs";
import { map, tap, flatMap } from "rxjs/operators";
const { check } = require("../middleware/check");

const mongoose = require('mongoose');

const {TreeData} = require("../models/TreeData");
const { Scene } = require('../models/Scene');
const { Game } = require('../models/Game');


function setTreeDate (gameId, userId, sceneId, sceneData, parentSceneId ) {
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

const getRecursive = (managedData, id) => {
  return getFromServer(managedData, id).pipe(
    map(data => ({
      parent: { 
        name: data.name, 
        sceneId: data.sceneId, 
        userId: data.userId, 
        id: data.id, 
        complaintCnt: data.complaintCnt, 
        characterName: data.characterName,
        firstScript: data.firstScript,
        children: []
      },
      childIds: data.children
    })),
    flatMap(parentWithChildIds =>
      forkJoin([
        of(parentWithChildIds.parent),
        ...parentWithChildIds.childIds.map(childId => getRecursive(managedData, childId))
      ])
    ),
    tap(
      ([parent, ...children]) => (parent.children = children)
    ),
    map(([parent]) => parent)
  );
};

const deleteCand = async (managedData, id) => {
  const data = managedData[id];
  await TreeData.deleteOne({_id: mongoose.Types.ObjectId(data._id)});
  console.log(data.sceneId);
  data.children.map((childId) => {
    deleteCand(managedData, childId);
  }) 
};

// mocked back-end response 
const getFromServer = (managedData, id) => {
  return of(managedData[id]);
};


router.get('/', check, async (req,res) => {
  let gamePlaying = req.isMember ? req.user.gamePlaying : req.session.gamePlaying;
  if (!req.user) {
    return res.status(400).json({ success: false, msg: "Can't find user" });
  }
  try{
    const gameId = gamePlaying.gameId;
    const sceneList = gamePlaying.sceneIdList;
    const sceneId = sceneList[sceneList.length-1];

    const sceneData = await Scene.findOne({ _id: mongoose.Types.ObjectId(sceneId)});
    if (sceneList.length > 1){
      const prevSceneId = sceneList[sceneList.length-2];
      const newTreeData = new TreeData(setTreeDate (gameId, req.user._id, sceneId, sceneData, sceneList[sceneList.length-2]));
      await TreeData.updateOne(
        {gameId: gameId, sceneId: prevSceneId},
        {$push: {children: newTreeData._id.toString()}}
        );
      await newTreeData.save();
    } else {
      const newTreeData = new TreeData(setTreeDate (gameId, req.user._id, sceneId, sceneData, "rootNode"));
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


router.post('/', async (req,res) => {
  try{
    const gameId = req.body.gameId;
    const rawData = await TreeData.find({gameId: gameId});
    const game = await Game.findOne( {_id: gameId}, {_id: 0, first_node:1} );
    const firstNodeId = game.first_node;
    const data = {};
    for (let i=0; i<rawData.length; i++){
      data = { ...data, [rawData[i]._id]: rawData[i]}
    } 
    let treeData; 
    getRecursive(data, firstNodeId).subscribe(d=> { treeData=d; })
    return res.status(200).json({success: true, treeData: treeData});
  } catch (err) {
    console.log(err)
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

    await TreeData.updateOne(
      { gameId: gameId, sceneId: parentSceneId},
      {$pull : {children: targetNodeId}}
    )

    if(firstNodeId === targetNodeId){
      return res.status(200).json({success: true, messege: "첫 씬은 삭제할 수 없습니다."});
    }
    const data = {};
    for (let i=0; i<rawData.length; i++){
      data = { ...data, [rawData[i]._id]: rawData[i]}
    } 
    console.log(data, targetNodeId) 
    deleteCand(data, targetNodeId);
    return res.status(200).json({success: true, messege: "성공적으로 삭제되었습니다."});
  } catch (err) {
    console.log(err);
    return res.json({ success: false, err });
  }
})

module.exports = router;
