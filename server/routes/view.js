const express = require('express');
const router = express.Router();

const { getView } = require('./functions/view');

router.post('/', async (req,res) => {
  try{
    const userId = req.body.userId;
    const objectId = req.body.objectId;
    const {view} = await getView(objectId, userId);
    return res.status(200).json({success: true, view: view})
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false });
  } 
})
 

module.exports = router;