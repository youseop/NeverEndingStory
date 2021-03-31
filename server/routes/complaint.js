const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const { Complaint } = require("../models/Complaint");

router.post('/save', async (req, res) => {
  const complaint = new Complaint({
    title : req.body.title,
    description : req.body.description,
    user : mongoose.Types.ObjectId(req.body.user),
    sceneId : mongoose.Types.ObjectId(req.body.sceneId),
    gameId : mongoose.Types.ObjectId(req.body.gameId),
  })
  complaint.save((err, complaint) => {
    if (err) return res.json({success: false, err})
    return res.status(200).json({success: true})
  })
})

module.exports = router;
