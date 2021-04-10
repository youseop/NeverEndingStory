const { Game } = require("../../models/Game");
const { User } = require("../../models/User");
const mongoose = require("mongoose");
const { ThumbsUp } = require("../../models/ThumbsUp");

async function getThumbsUp(objectId, userId){
    const thumbsup = await ThumbsUp.findOne({objectId: objectId});
    let isClicked = false;
    let thumbsupCnt = 0;
    if(
    thumbsup?.userList &&
    Object.keys(thumbsup?.userList).includes(userId) && 
    thumbsup.userList[userId] === true
    ){
    isClicked = true;
    thumbsupCnt = thumbsup.cnt;
    } else if (thumbsup) {
    isClicked = false;
    thumbsupCnt = thumbsup.cnt;
    }
  return {isClicked, thumbsupCnt} 
}
 
module.exports = { getThumbsUp };