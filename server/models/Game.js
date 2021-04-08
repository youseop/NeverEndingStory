const mongoose = require('mongoose');
const { 
        characterSchema, backgroundSchema,
        bgmSchema, soundSchema, contributerSchema 
      } = require('./Game_Components');

const Schema = mongoose.Schema;

const gameSchema = mongoose.Schema({
  view : {
    type: Number,
    default: 1
  },
  thumbsUp: {
    type: Number,
    default: 0
  },
  like: {
    type: Number,
    default: 0
  },
  title : {
    type: String,
    maxlength: 50
  },
  description : {
    type: String
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  first_scene: {
    type: Schema.Types.ObjectId,
    ref: 'Scene'
  },
  first_node: {
    type: String,
  },
  character: [characterSchema],
  background: [backgroundSchema],
  bgm: [bgmSchema],
  sound: [soundSchema],
  thumbnail : {
    type: String
  },
  category : {
    type: String
  },
  privacy : {
    type: String
  },
  ratio : {
    type: String
  },
  ready: {
    type: Number,
    default: 0
  },
  contributerList: [contributerSchema],
  sceneCnt: {
    type: Number,
    default: 1
  },
  parentGameId:{
    type: Schema.Types.ObjectId,
    ref : 'Game'
  },
  childrenGameId:[{
    type: Schema.Types.ObjectId,
    ref :'Game'
  }]
}, {timestamps: true})

const Game = mongoose.model('Game', gameSchema);

module.exports = { 
  Game,
 }