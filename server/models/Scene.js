const mongoose = require('mongoose');
const { 
  characterSchema, backgroundSchema,
  bgmSchema, soundSchema 
} = require('./Game_Components');

const Schema = mongoose.Schema;

const nextSceneSchema = mongoose.Schema({
  sceneId: {
    type: String
  },
  script: {
    type: String
  }
})

const cutSchema = mongoose.Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game'
  },
  sceneId: {
    type: Schema.Types.ObjectId,
    ref: 'Scene'
  },
  characterCnt : {
    type: Number,
    default: 0
  },
  name: {
    type: String
  },
  script: {
    type: String
  },
  characterList: [characterSchema],
  bgm: {
    type: Schema.Types.ObjectId,
    ref: 'bgm'
  },
  background: {
    type: Schema.Types.ObjectId,
    ref: 'background'
  },
  sound: {
    type: Schema.Types.ObjectId,
    ref: 'sound'
  }
})

const Cut = mongoose.model('cut', cutSchema);

const sceneSchema = mongoose.Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game'
  },
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  recommend: {
    type: Number,
    default: 0
  },
  notRecommend: {
    type: Number,
    default: 0
  },
  depth: {
    type: Number,
    default: 0
  },
  nextList: [nextSceneSchema],
  cutList: [cutSchema],
  status: {
    type: Number,
    default: 0 //? 0:껍데기 1:내용이 들어있는 상태
  },
  isFirst: {
    type: Number,
    default: 0,
  }
})

const Scene = mongoose.model('Scene', sceneSchema);

module.exports = { 
  Scene, sceneSchema,
  Cut, cutSchema 
}