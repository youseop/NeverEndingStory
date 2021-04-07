const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {ThumbsUp} = require("../models/ThumbsUp");


router.post('/count', (req,res) => {
  const objectId = req.body.objectId;
  ThumbsUp.findOne({"objectId" : objectId})
    .exec((err, thumbsup) => {
      if(err) return res.status(400).send(err);
      let isClicked = false;
      if(
        thumbsup?.userList &&
        Object.keys(thumbsup?.userList).includes(req.body.userId) && 
        thumbsup.userList[req.body.userId] === true
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


router.post('/', (req,res) => {
  const userId = req.body.userId;
  const objectId = req.body.objectId;
  ThumbsUp.findOne({"objectId" : objectId})
    .exec((err, thumbsup) => {
      let isClicked = false;
      if(err) return res.status(400).send(err);
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
        }

        thumbsup.save((err) => {
          if(err) return res.json({success: false, err})
          res.status(200).json({success: true, thumbsup:thumbsup.cnt, isClicked: isClicked})
        })
      }else{
        return res.status(200).json({success: true, thumbsup: 0, isClicked: false})
      }
    })
})


module.exports = router;