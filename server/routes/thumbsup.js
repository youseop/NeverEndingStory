const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Game } = require('../models/Game');

const {ThumbsUp} = require("../models/ThumbsUp");


router.get('/:objectId/:userId', (req,res) => {
  const {objectId, userId} = req.params;
  ThumbsUp.findOne({"objectId" : objectId})
    .exec((err, thumbsup) => {
      if(err) return res.status(400).send(err);
      let isClicked = false;
      if(
        thumbsup?.userList &&
        Object.keys(thumbsup?.userList).includes(userId) && 
        thumbsup.userList[userId] === true
      ){
        isClicked = true;
        res.status(200).json({success: true, thumbsup:thumbsup.cnt, isClicked: isClicked})
      } else if (thumbsup) {
        res.status(200).json({success: true, thumbsup: thumbsup.cnt, isClicked: false})
      } else {
        res.status(200).json({success: true, thumbsup: 0, isClicked: false})
      }
  }) 
})

//<<flag>>
// "1" : game
// "2" : scene

router.post('/', async (req,res) => {
  try {
    const userId = req.body.userId;
    const objectId = req.body.objectId;
    const flag = req.body.flag;
    let inc = 1;
    const thumbsup = await ThumbsUp.findOne({"objectId" : objectId});
    let isClicked = false;
    if (thumbsup && thumbsup.userList){
      if(
        !Object.keys(thumbsup.userList).includes(userId) ||
        thumbsup.userList[userId] === false
      ){
        thumbsup.cnt += 1;
        thumbsup.userList = {
          ...thumbsup.userList, 
          [userId]: true
        };
        isClicked = true;
      } else {
        thumbsup.userList = {
          ...thumbsup.userList, 
          [userId]: false
        }
        thumbsup.cnt -= 1; 
        inc = -1;
      }
      await thumbsup.save();
      if (flag === "1"){
        await Game.updateOne(
          {_id: mongoose.Types.ObjectId(objectId)},
          {$inc : {thumbsUp : inc}}
        );
      }
      return res.status(200).json({success: true, thumbsup:thumbsup.cnt, isClicked: isClicked})
    }else{
      return res.status(200).json({success: true, thumbsup: 0, isClicked: false})
    }
  } catch (err) {
    console.log(err)
    return res.json({ success: false, err })
  }

  ThumbsUp.findOne({"objectId" : objectId})
    .exec((err, thumbsup) => {
    })
})


module.exports = router;