const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const graphLookupSchema = mongoose.Schema({
  name: String,
  reportsTo: String,
});

const GraphLookup = mongoose.model('graphLookup', graphLookupSchema);

const testTreeSchema = Schema({
  userId: String,
  sceneId: String,
  name: String,
  complaintCnt: {
    type: Number,
    default: 0
  },
  children: [String],
},{ strict: false });

const TestTree = mongoose.model('testTree', testTreeSchema);

module.exports = {GraphLookup, TestTree}
