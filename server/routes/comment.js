const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const { Comment } = require("../models/Comment");

router.post('/saveComment', async (req, res) => {
  const comment = new Comment({
    content : req.body.content,
    writer : req.body.writer,
    gameId : mongoose.Types.ObjectId(req.body.gameId),
    responseTo : req.body.responseTo
  })
  comment.save((err, comment) => {
    if (err) return res.json({success: false, err})

    Comment.findOne({'_id':comment._id})
    .populate('writer')
    .exec((err, result) => {
      if (err) return res.json({success: false, err})
      return res.status(200).json({success: true, result})
    })

  })
})


router.post('/getComment', async (req, res) => {
  Comment.find({'gameId': mongoose.Types.ObjectId(req.body.gameId)
              , 'responseTo': ""})
  .populate('writer')
  // .sort('createdAt')
  .sort({createdAt: 'descending'})
  .exec((err, result) => {
    if (err) return res.json({success: false, err})
    return res.status(200).json({success: true, result})  
  })
})

router.post('/removeComment', async (req, res) => {
  try {
    await Comment.deleteOne({'_id': req.body.commentId})
    return res.status(200).json({success: true})  
  } catch {
    return res.json({success: false, err})
  }
})

router.post('/getReply', async (req, res) => {
  Comment.find({'gameId': mongoose.Types.ObjectId(req.body.gameId)
              , 'responseTo': req.body.responseTo})
  .populate('writer')
  // .sort('createdAt')
  .sort({createdAt: 'descending'})
  .exec((err, result) => {
    if (err) return res.json({success: false, err})
    return res.status(200).json({success: true, result})  
  })
})

module.exports = router;
