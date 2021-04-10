const express = require('express');
const router = express.Router();

const { getThumbsUp } = require('./functions/thumbsup');
const { getRank, getDetail } = require('./functions/game');
const { getView } = require('./functions/view');


router.get('/:gameId/:userId', async (req, res) => {
  try{
    const { gameId, userId } = req.params;

    const {gameDetail} = await getDetail(gameId);
    const {topRank, contributerCnt, sceneCnt} = await getRank(req.params.gameId);
    const {isClicked, thumbsupCnt} = await getThumbsUp(gameId, userId);
    const {view} = await getView(gameId, userId);

    return res.status(200).json({ 
      success: true, 
      topRank: topRank,
      contributerCnt: contributerCnt,
      totalSceneCnt: sceneCnt,
      gameDetail: gameDetail,
      isClicked: isClicked,
      thumbsup: thumbsupCnt, 
      view: view 
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false });
  } 
})


module.exports = router;
