const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sceneInfoSchema = Schema({
  sceneId: String,
  depth: Number
})

const contributedSceneSchema = Schema({
    gameId: {
        type: Schema.Types.ObjectId,
        ref: "Game",
    },
    sceneList: [sceneInfoSchema],
    sceneCnt: {
      type: Number,
      default: 1
    },
    title: String,
    thumbnail: String,
    description: String,
})

const contributedGameSchema = Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: "Game",
  }, 
  title: String,
  thumbnail: String,
  description: String,
})

const ContributedScene = mongoose.model('ContributedScene', contributedSceneSchema);

module.exports = { ContributedScene, contributedSceneSchema, contributedGameSchema }