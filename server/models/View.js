const mongoose = require('mongoose');

const Schema = mongoose.Schema;
/*
 * game 
 * scene 
 */
const viewSchema = mongoose.Schema({
  objectId: {
    type: String,
  },
  cnt: {
    type: Number,
    default: 1
  },
  userList: {}
});

const View = mongoose.model('views', viewSchema);

module.exports = {View}
