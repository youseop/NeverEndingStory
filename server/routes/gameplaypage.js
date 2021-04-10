const express = require('express');
const router = express.Router();

const { getThumbsUp } = require('./functions/thumbsup');
const { getView } = require('./functions/view');


router.get('/:objectId/:userId', async (req, res) => {
  try{
    const { objectId, userId } = req.params;
    const {isClicked, thumbsupCnt} = await getThumbsUp(objectId, userId);
    const {view} = await getView(objectId, userId);
    
    return res.status(200).json({
      success: true, 
      view: view,
      isClicked: isClicked,
      thumbsup: thumbsupCnt
    })
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false });
  } 
})


module.exports = router;
