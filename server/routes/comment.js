const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const { Comment } = require("../models/Comment");
const { Like } = require('../models/Like');

router.post('/', async (req, res) => {
  let comment;
  if (req.body.sceneId.length > 0){
    comment = new Comment({
      content: req.body.content,
      writer: req.body.writer,
      gameId: mongoose.Types.ObjectId(req.body.gameId),
      sceneId: mongoose.Types.ObjectId(req.body.sceneId),
      responseTo: req.body.responseTo
    })
  } else {
    comment = new Comment({
      content: req.body.content,
      writer: req.body.writer,
      gameId: mongoose.Types.ObjectId(req.body.gameId),
      responseTo: req.body.responseTo
    })
  }

  await comment.save();
  if(req.body.responseTo.length > 0)
  {
    Comment.updateOne(
      {_id: req.body.responseTo},
      {$inc : {responseCnt: 1}}
      ).exec();
  }
  return res.status(200).json({ success: true })
})


router.get('/:gameId', async (req, res) => {
  const {gameId} = req.params;
  Comment.find({
    'gameId': mongoose.Types.ObjectId(gameId), 
    'responseTo': "",
    'sceneId': { $exists: false }
  })
    .populate('writer')
    .sort({ createdAt: 'descending' })
    .exec((err, result) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, err })
      }
      return res.status(200).json({ success: true, result })
    })
})

router.get('/scene/:gameId/:sceneId', async (req, res) => {
  const {gameId, sceneId} = req.params;
  Comment.find({
    'gameId': mongoose.Types.ObjectId(gameId), 
    'responseTo': "",
    'sceneId': mongoose.Types.ObjectId(sceneId)
  })
    .populate('writer')
    .sort({ createdAt: 'descending' })
    .exec((err, result) => {
      if (err) return res.json({ success: false, err })
      return res.status(200).json({ success: true, result })
    })
})

router.delete('/:commentId/:gameId', async (req, res) => {
  try {
    const {commentId, gameId} = req.params;
    const comment = await Comment.findOne(
      { _id: mongoose.Types.ObjectId(commentId) },
      { _id: 0, responseTo: 1 }
    );
    if (comment.responseTo) {
      Comment.updateOne(
        { _id: comment.responseTo },
        { $inc: { responseCnt: -1 } }
      ).exec();
    }
    Comment.deleteOne(
      { '_id': mongoose.Types.ObjectId(commentId) }
    ).exec();
    Like.deleteOne(
      { 'commentId': mongoose.Types.ObjectId(commentId) }
    ).exec();

    const replies = await Comment.find(
      { gameId: gameId, responseTo: commentId },
      { _id: 1 }
    );
    for(let i=0; i<replies.length; i++){
      Like.deleteOne(
        { 'commentId': replies[i]._id }
      ).exec();
    }
    Comment.deleteMany(
      {gameId: gameId, responseTo: commentId}
    ).exec();

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.json({ success: false, err });
  }
})

router.patch('/:commentId/:comment', async (req, res) => {
  const {commentId, comment} = req.params;
  try {
    await Comment.updateOne(
      { _id: mongoose.Types.ObjectId(commentId)},
      { $set: {content: comment}}
    )
    return res.status(200).json({ success: true })
  } catch {
    return res.json({ success: false, err })
  }
})

router.get('/:gameId/:commentId', async (req, res) => {
  const { gameId, commentId } = req.params;
  Comment.find({
    'gameId': mongoose.Types.ObjectId(gameId), 
    'responseTo': commentId
  })
    .populate('writer')
    .sort('createdAt')
    .exec((err, result) => {
      if (err) return res.json({ success: false, err })
      return res.status(200).json({ success: true, result })
    })
})

module.exports = router;