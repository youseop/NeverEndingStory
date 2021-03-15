const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {Teacher, Student, Class} = require("../models/Subdoc_test");
const { Game } = require("../models/Game");


router.get('/uploadClass', (req, res) => {
  const newClass = new Class({
    grade: 1,
    class: 3,
    teacher: new Teacher({
      name: "youseop",
      age: 26,
      subject: "coding"
    }),
    student: [new Student({
      name: "student1",
      age: 14,
      subject: "coding"
    })]
  })

  newClass.save((err, doc) => {
    if(err) return res.json({success: false, err})
    res.status(200).json({success: true})
  })
})

router.get('/getClass', (req,res) => {
  Class.find().exec((err, classes) => {
    if(err) return res.status(400).send(err);
    res.status(200).json({success: true, classes})
  })
})

router.post('/updateClass', (req,res) => {
  // console.log("start")
  Class.findOne({"_id" : mongoose.Types.ObjectId(req.body.gameId)})
    .populate('creator')
    .exec((err, find_class) => {
      if(err) return res.status(400).send(err)

      // console.log(req.body)
      const student = new Student(req.body.student);
      find_class.student.push(student);

      find_class.save((err,doc) => {
        if(err) return res.json({success: false, err})

        res.status(200).json({success: true})
      })
    })

})

module.exports = router;