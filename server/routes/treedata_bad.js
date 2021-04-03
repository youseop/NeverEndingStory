const express = require('express');
const router = express.Router();
const { check } = require("../middleware/check");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {TreeData} = require("../models/TreeData");
const { Scene } = require('../models/Scene');


function searchTreeData (treeData,index,indexList,sceneList) {
  // 첫씬&마지막씬의 index는 찾을 필요 없다. >> '-2'
  if (indexList.length === sceneList.length - 2){ 
    return indexList;
  }
  const children = treeData.children;
  for (let i=0; i<children.length; i++){
    if (children[i].sceneId.toString() === sceneList[index].toString()){
      indexList.push(i)
      return searchTreeData(children[i], index+1, indexList, sceneList);
    }
  }
}


function setTreeDate (gameId, user, sceneId, sceneData ) {
  return ({
    gameId: gameId, 
    userId: user._id, 
    sceneId: sceneId, 
    name: "node",
    characterName: sceneData.cutList[0].name, 
    firstScript: sceneData.cutList[0].script, 
    isEnding: sceneData.isEnding,
    children: []
  })
}


router.get('/', check, async (req,res) => {
  let gamePlaying = req.isMember ? req.user.gamePlaying : req.session.gamePlaying;
  if (!req.user) {
    return res.status(400).json({ success: false, msg: "Can't find user" });
  }
  try{
    const gameId = gamePlaying.gameId;
    const treeData = await TreeData.findOne({ gameId: gameId});
    const sceneList = gamePlaying.sceneIdList;
    
    if (treeData) {
      const sceneId = sceneList[sceneList.length-1];
      const sceneData = await Scene.findOne({ _id: mongoose.Types.ObjectId(sceneId)});
      const indexList = searchTreeData(treeData,1,[],sceneList);

      //문자열로 명령문 제작후 'eval'로 실행.
      const execString = 'treeData';
      for (let i=0; i<indexList.length; i++) {
        execString += `.children[indexList[${i}]]`;
      }
      execString += '.children';
      execString+='=[...'+execString+',newTreeData]';
      const newTreeData = new TreeData(setTreeDate (gameId, req.user, sceneId, sceneData ));
      eval(execString);
      await treeData.save();
  } else {
      const sceneId = sceneList[0]; 
      const sceneData = await Scene.findOne({ _id: mongoose.Types.ObjectId(sceneId)});
      const treeData = new TreeData(setTreeDate (gameId, req.user, sceneId, sceneData ));
      await treeData.save();
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
    const treeData = await TreeData.findOne({ gameId: gameId});
    return res.status(200).json({success: true, treeData: treeData});
  } catch (err) {
    console.log(err)
    return res.json({ success: false, err })
  }
})


module.exports = router;
