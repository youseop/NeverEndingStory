const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const commentSchema = Schema({
  writer : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  gameId : {
    type: Schema.Types.ObjectId,
    ref: 'Game'
  },
  responseTo : {
    type: String
  },
  content : {
    type: String
  }
}, {timestamps: true})


const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment, commentSchema }