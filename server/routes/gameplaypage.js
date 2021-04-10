const express = require('express');
const { getSpecificDetail } = require('./functions/game');
const router = express.Router();

const { getThumbsUp } = require('./functions/thumbsup');
const { getView } = require('./functions/view');
const { getSpecificDetail } = require('./functions/game');


router.get('/sceneinfo/:sceneId/:userId', async (req, res) => {
  try{
    const { sceneId, userId } = req.params;
    const {isClicked, thumbsupCnt} = await getThumbsUp(sceneId, userId);
    const {view} = await getView(sceneId, userId);
    
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

router.get('/gameinfo/:gameId/:userId', async (req,res) => {
  try{
    const { gameId, userId } = req.params;
    const {isClicked, thumbsupCnt} = await getThumbsUp(gameId, userId);
    const {gameDetail} = await getSpecificDetail(gameId);
    
    return res.status(200).json({
      success: true, 
      isClickedGame: isClicked,
      thumbsupCntGame: thumbsupCnt,
      gameDetail: gameDetail
    })
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false });
  }
})


module.exports = router;
