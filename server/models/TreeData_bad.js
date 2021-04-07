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
},{ strict: false });

treeDataSchema.add({ children: [treeDataSchema] });

const TreeData = mongoose.model('TreeData', treeDataSchema);

module.exports = { TreeData, treeDataSchema }