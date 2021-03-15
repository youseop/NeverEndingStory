const express = require('express');
const router = express.Router();

const { Scene } = require("../models/Scene");


router.post('/save', (req, res) => {
  
  console.log(req.body)

  const scene = new Scene({
    gameId : req.body.gameId,
    writer : req.body.writer,
    nextList : req.body.nextList,
    cutList : req.body.cutList,
    isFirst : req.body.isFirst
  })

  for(let i = 0 ; i < req.body.cutList.length; i++){
    scene.cutList[i].characterList = [...req.body.cutList[i].characterList];
  }

  scene.save((err, scene) => {
    console.log('hey!!!')
    if(err) return res.json({success: false, err})
    console.log(scene);
    res.status(200).json({success: true, scene})
  })
})


module.exports = router;
