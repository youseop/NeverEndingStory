const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const { Comment } = require("../models/Comment");

router.post('/save-comment', async (req, res) => {
  const comment = new Comment({
    content: req.body.content,
    writer: req.body.writer,
    gameId: mongoose.Types.ObjectId(req.body.gameId),
    responseTo: req.body.responseTo
  })

  await comment.save();
  Comment.updateOne(
    {_id: req.body.responseTo},
    {$inc : {responseCnt: 1}}
  ).exec();
  Comment.findOne({ '_id': comment._id })
  .populate('writer')
  .exec((err, result) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({ success: true, result })
  })
})


router.get('/:gameId', async (req, res) => {
  Comment.find({
    'gameId': mongoose.Types.ObjectId(req.params.gameId)
    , 'responseTo': ""
  })
    .populate('writer')
    // .sort('createdAt')
    .sort({ createdAt: 'descending' })
    .exec((err, result) => {
      if (err) return res.json({ success: false, err })
      return res.status(200).json({ success: true, result })
    })
})

router.post('/remove-comment', async (req, res) => {
  try {
    const commentId = req.body.commentId;
    const comment = await Comment.findOne(
      {_id:  mongoose.Types.ObjectId(commentId)},
      {_id: 0, responseTo: 1}
    );
    if (comment.responseTo){
      Comment.updateOne(
        {_id: comment.responseTo},
        {$inc : {responseCnt: -1}}
      ).exec();
    }
    Comment.deleteOne(
      { '_id': mongoose.Types.ObjectId(commentId) }
    ).exec();
    Comment.deleteMany(
      {responseTo: commentId}
    ).exec();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.json({ success: false, err });
  }
})

router.post('/edit-comment', async (req, res) => {
  try {
    await Comment.updateOne(
      { _id: mongoose.Types.ObjectId(req.body.commentId) },
      { $set: {content: req.body.comment}}
    )
    return res.status(200).json({ success: true })
  } catch {
    return res.json({ success: false, err })
  }
})

router.get('/:gameId/:commentId', async (req, res) => {
  const {gameId, commentId} = req.params;
  Comment.find({
    'gameId': mongoose.Types.ObjectId(gameId)
    , 'responseTo': commentId
  })
    .populate('writer')
    .sort('createdAt')
    .exec((err, result) => {
      if (err) return res.json({ success: false, err })
      return res.status(200).json({ success: true, result })
    })
})

module.exports = router;