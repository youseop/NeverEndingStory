const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

const {TreeData} = require("../models/TreeData");
const { Complaint } = require("../models/Complaint");


router.post('/', async (req, res) => {
  try{
    const { gameId, sceneId } = req.body;
    const complaint = new Complaint({
      title : req.body.title,
      description : req.body.description,
      user : mongoose.Types.ObjectId(req.body.user),
      sceneId : mongoose.Types.ObjectId(sceneId),
      gameId : mongoose.Types.ObjectId(gameId),
    })
    await complaint.save();

    await TreeData.updateOne(
      {gameId: gameId, sceneId: sceneId},
      {$inc: {complaintCnt: 1}}
      );
    
    return res.status(200).json({success: true});
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false });
  }
})


module.exports = router;
