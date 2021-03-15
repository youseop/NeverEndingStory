const express = require('express');
const router = express.Router();

const { Scene } = require("../models/Scene");


router.post('/uploadscene', (req, res) => {
  console.log(req.body)
  const scene = new Scene(req.body)
  scene.save((err, scene) => {
    console.log('hey!!!')
    if(err) return res.json({success: false, err})
    console.log(scene);
    res.status(200).json({success: true, scene})
  })
})


module.exports = router;
