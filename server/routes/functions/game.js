const { Game } = require("../../models/Game");
const { User } = require("../../models/User");
const mongoose = require("mongoose");

async function getRank(gameId){
  const gameDetail = await Game.findOne(
      { _id: gameId },
      { _id: 0, sceneCnt: 1, contributerList: 1 }
  )
  const contributerList = gameDetail.contributerList;
  const contributerCnt = contributerList.length;
  contributerList.sort(function (a, b) {
      return a.userSceneCnt < b.userSceneCnt ? 1 : a.userSceneCnt > b.userSceneCnt ? -1 : 0;
  });
  
  const topRank = contributerList.slice(0, 5);

  for (let i = 0; i < topRank.length; i++) {
      const user = await User.findOne({ _id: mongoose.Types.ObjectId(topRank[i].userId) })
      topRank[i] = {
          nickname: user.nickname,
          email: user.email,
          image: user.image,
          userId: user._id,
          userSceneCnt: topRank[i].userSceneCnt,
          sceneIdList: topRank[i].sceneIdList
      }
  }
  const sceneCnt = gameDetail.sceneCnt;
  return {topRank, contributerCnt, sceneCnt};
}

async function getDetail(gameId){
  const gameDetail = await Game.findOne({ _id: gameId }).populate("creator");
  return {gameDetail}
}

module.exports = { getRank, getDetail };