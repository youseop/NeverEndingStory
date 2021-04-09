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
  sceneId : {
    type: Schema.Types.ObjectId,
    ref: 'Scene'
  },
  responseTo : {
    type: String
  },
  content : {
    type: String
  },
  like:{
    type: Number,
    default: 0
  }
}, {timestamps: true})

treeDataSchema.index({ gameId: 1, responseTo: 1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment, commentSchema }