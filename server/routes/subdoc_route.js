const express = require('express');
const router = express.Router();

const {Teacher, Student, Class} = require("../models/Subdoc_test");


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

module.exports = router;