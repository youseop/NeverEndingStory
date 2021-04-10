const { Game } = require("../../models/Game");
const { View } = require("../../models/View");

const TIME_THRESHOLD = 20*60*1000;

async function getView(objectId, userId){
  const view = await View.findOne({"objectId" : objectId});
  if (userId && view && view.userList){
    if(
    !Object.keys(view.userList).includes(userId) ||
    TIME_THRESHOLD < (new Date()).getTime() - view.userList[userId]
    ){
      Game.updateOne({_id: objectId}, { $inc: {view: 1}}).exec();
      view.cnt += 1;
      view.userList = {
        ...view.userList, 
        [userId]: (new Date()).getTime()
      }
      view.save();
    }
    return { view : view.cnt }
  } else if (view) {
    return { view : view.cnt }
  }
  else{
    return { view : 0 }
  }
}
 
module.exports = { getView };