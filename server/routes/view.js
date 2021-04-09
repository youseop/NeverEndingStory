const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Game } = require('../models/Game');
const { Scene } = require('../models/Scene');

const TIME_THRESHOLD = 20*60*1000;

const {View} = require("../models/View");

router.post('/', (req,res) => {
  const userId = req.body.userId;
  const objectId = req.body.objectId;
  View.findOne({"objectId" : objectId})
  .exec((err, view) => {
    if(err) return res.status(400).send(err);
    if (userId && view && view.userList){
        if(
          !Object.keys(view.userList).includes(userId) ||
          TIME_THRESHOLD < (new Date()).getTime() - view.userList[userId]
          ){
            Game.updateOne({_id: mongoose.Types.ObjectId(objectId)}, { $inc: {view: 1}}).exec();
            view.cnt += 1;
            view.userList = {
              ...view.userList, 
              [userId]: (new Date()).getTime()
            }
        } else {
          return res.status(200).json({success: true, view: view.cnt})
        }
        view.save((err, a) => {
          if(err) return res.json({success: false, err})
          res.status(200).json({success: true, view:view.cnt})
        })
      } else if (view) {
        return res.status(200).json({success: true, view: view.cnt})
      }
      else{
        return res.status(200).json({success: true, view: 0})
      }
    })
})


module.exports = router;