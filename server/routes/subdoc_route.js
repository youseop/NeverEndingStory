const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {Teacher, Student, Class} = require("../models/Subdoc_test");

router.get('/', (req,res) => {
  const teacher = new Teacher({
    title: "new schema",
    likeCount: 0,
    userList: {}
  })
  teacher.save((err, doc) => {
    if(err) return res.json({success: false, err})
    res.status(200).json({success: true})
  })
})

// db.test.update({ 'sid': 's1'}, { $set: { 'score': 100 } });

router.get('/viewcnt', async (req,res) => {
  try{
    const a = await Teacher.findOne({ title: "new schema"});
    const user = 'user2';
    a.userList = {...a.userList, [user]: 1}
    a.save();
    return res.status(200).json({success: true})
  } catch {
    return res.json({success: false, err}) 
  }
})

router.get('/user', async (req,res) => {
  const user = 'user2';
  try{
    const a = await Teacher.findOne({ title: "new schema"});
    if (a || a.userList){
      const userList = a.userList;
      if(Object.keys(userList).includes(user)){
        a.likeCount += 1;
        a.userList = {...a.userList, [user]: 1}
        await a.save();
      }
    }
    return res.status(200).json({success: true})
  } catch {
    return res.json({success: false, err})
  }
})

router.get('/user1', (req,res) => {
  const user = 'user9';
    Teacher.findOne({ title: "new schema"}).exec((err, a) => {
      if(err) return res.status(400).send(err)
      if (a && a.userList){
        const userList = a.userList;
        if(!Object.keys(userList).includes(user)){
          a.likeCount += 1;
          a.userList = {...a.userList, [user]:(new Date()).getTime()}
          a.save((err, doc) => {
            if(err) return res.json({success: false, err})
            return res.status(200).json({success: true, addview: 1})
          })
        }
        return res.json({success: true, addview: 2})
      }
      return res.json({success: true, addview: 3})
    })
})

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
  Class.findOne({"_id" : mongoose.Types.ObjectId(req.body.gameId)})
    .populate('creator')
    .exec((err, find_class) => {
      if(err) return res.status(400).send(err)

      const student = new Student(req.body.student);
      find_class.student.push(student);

      find_class.save((err,doc) => {
        if(err) return res.json({success: false, err})

        res.status(200).json({success: true})
      })
    })

})

module.exports = router;