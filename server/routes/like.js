const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const { Like } = require("../models/Like");

router.post('/', async(req,res) => {
  Like.find({
    'userId': mongoose.Types.ObjectId(req.body.userId),
    'gameId': mongoose.Types.ObjectId(req.body.gameId),
    'commentId': mongoose.Types.ObjectId(req.body.commentId),
  }).exec((err, result) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({ success: true, result })
  })
})

router.post('/setlike', async(req,res) => {
  try{
    const like = await Like.find({
    'gameId': req.body.gameId,
    'userId': mongoose.Types.ObjectId(req.body.userId),
      'commentId': req.body.commentId,
    })
    if(like.length === 0){
      const like = new Like({
      gameId: req.body.gameId,
      userId: mongoose.Types.ObjectId(req.body.userId),
      commentId: req.body.commentId,
      })
      like.save()
      return res.status(200).json({ success: true})
    } else {
      for (let i=0; i<like.length; i++){
        Like.deleteOne({_id: like[i]._id})
      }
      return res.status(200).json({ success: true})
    }
  } catch (err){
    return res.status(400).json({ success: false });
  }
})

module.exports = router;