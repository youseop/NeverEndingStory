const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const objectIdSchema = mongoose.Schema({
  objectId: {
    type: Schema.Types.ObjectId,
    //? 가능할까
  }
})

const sceneSchema = mongoose.Schema({
  scene_gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game'
  },
  scene_writer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  scene_recommend: {
    type: Number,
    default: 0
  },
  scene_notRecommend: {
    type: Number,
    default: 0
  },
  scene_depth: {
    type: Number,
    default: 0
  },
  scene_nextList: [objectIdSchema],
  scene_status: {
    type: Number,
    default: 0 //? 0:껍데기 1:내용이 들어있는 상태
  }
})

const Scene = mongoose.model('Scene', sceneSchema);

module.exports = { Scene }