const express = require('express');
const router = express.Router();
const { check } = require("../middleware/check");
const { auth } = require("../middleware/auth");

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

router.get('/', auth, async (req,res) => {
  if (!req.user) {
      return res.status(400).json({ success: false, msg: "Can't find user" });
  }
  try{
    const gameId = req.user.gamePlaying.gameId;
    const treeData = await TreeData.findOne({ gameId: gameId});
    const sceneList = req.user.gamePlaying.sceneIdList;
    
    if (treeData) {
      const sceneId = sceneList[sceneList.length-1];
      const sceneData = await Scene.findOne({ _id: mongoose.Types.ObjectId(sceneId)});
      const indexList = searchTreeData(treeData,1,[],sceneList);

      const execString = 'treeData';
      for (let i=0; i<indexList.length; i++) {
        execString += `.children[indexList[${i}]]`;
      }
      execString += '.children';

      execString+='=[...'+execString+',newTreeData]';

      const newTreeData = new TreeData({
        gameId: gameId, 
        userId: req.user._id, 
        sceneId: sceneId, 
        name: "node",
        characterName: sceneData.cutList[0].name, 
        firstScript: sceneData.cutList[0].script, 
        children: []
      });
      eval(execString);
      newTreeData.markModified('children.children');
      await treeData.save();
    } else {
      const sceneId = sceneList[0]; 
      const sceneData = await Scene.findOne({ _id: mongoose.Types.ObjectId(sceneId)});
      let treeData = new Schema({any : Schema.Types.Mixed});
      const treeData = new TreeData({
        gameId: gameId,
        userId: req.user._id,
        sceneId: sceneId,
        name: "node",
        characterName: sceneData.cutList[0].name,
        firstScript: sceneData.cutList[0].script,
        children: []
      })
      treeData.markModified('children.children');
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