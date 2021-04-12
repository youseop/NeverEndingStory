const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const thumbsUpSchema = Schema({
  objectId: {
    type: String,
  },
  cnt: {
    type: Number,
    default: 0
  },
  userList: {}
},{ strict: false });

thumbsUpSchema.index({ objectId: 1 });

const ThumbsUp = mongoose.model('ThumbsUp', thumbsUpSchema);

module.exports = { ThumbsUp, thumbsUpSchema }