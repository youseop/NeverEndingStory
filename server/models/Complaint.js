const mongoose = require('mongoose');
const { userSchema } = require("./User");

const Schema = mongoose.Schema;

const complaintSchema = mongoose.Schema({
  checked : {
    type: Number,
    default: 0
  },
  title : {
    type: String,

  },
  description : {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  sceneId: {
    type: Schema.Types.ObjectId,
    ref: 'Scene'
  },
  gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
  },
}, {timestamps: true})

complaintSchema.index({ gameId: 1, sceneId: 1});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = { Complaint }