const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

const {TreeData} = require("../models/TreeData");
const { Complaint } = require("../models/Complaint");

const { auth } = require("../middleware/auth");


router.post('/', auth, async (req, res) => {
  if (!req.user) {
    return res.status(400).json({success: false, msg: "Can't find user" });
  }
  try{
    console.log(req.user,'user!!')
    const complaint = new Complaint({
      title : req.body.title,
      description : req.body.description,
      user : mongoose.Types.ObjectId(req.body.user),
      sceneId : mongoose.Types.ObjectId(req.body.sceneId),
      gameId : mongoose.Types.ObjectId(req.body.gameId),
    })
    await complaint.save();
    return res.status(200).json({success: true});
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false });
  }
})


module.exports = router;
