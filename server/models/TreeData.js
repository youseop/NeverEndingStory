const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const treeDataSchema = Schema({
  gameId: String,
  userId: String,
  sceneId: String,
  name: String,
  characterName: String,
  firstScript: String,
  complaintCnt: {
    type: Number,
    default: 0
  },
  children: [String],
  isEnding: Boolean,
  parentSceneId: String,
});

treeDataSchema.index({ gameId: 1, sceneId: 1});

const TreeData = mongoose.model('TreeData', treeDataSchema);

module.exports = { TreeData, treeDataSchema }