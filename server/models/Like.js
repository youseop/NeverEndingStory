const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const likeSchema = Schema({
  userId : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  gameId : {
    type: Schema.Types.ObjectId,
    ref: 'Game'
  },
  commentId : {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }
})


const Like = mongoose.model('Like', likeSchema);

module.exports = { Like, likeSchema }