const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const { Like } = require("../models/Like");
const { Comment } = require("../models/Comment");

router.post('/', async(req,res) => {
  const {userId, gameId, commentId} = req.body;
  let isClicked = false;
  try{
    const like = await Like.findOne({
      'userId': mongoose.Types.ObjectId(userId),
      'gameId': gameId,
      'commentId': commentId,
    });
    if(like){
      Comment.updateOne(
        {_id : commentId},
        {$inc : {like : -1}}
      ).exec();
      Like.deleteOne({_id: like._id}).exec();
    } else {
      Comment.updateOne(
        {_id : commentId},
        {$inc : {like : 1}}
      ).exec();
      const newLike = new Like({
        gameId: gameId,
        userId: mongoose.Types.ObjectId(userId),
        commentId: commentId
      });
      newLike.save();
      isClicked = true;
    }
    return res.status(200).json({ success: true, isClicked: isClicked})
  } catch (err){
    return res.status(400).json({ success: false });
  }
})

module.exports = router;