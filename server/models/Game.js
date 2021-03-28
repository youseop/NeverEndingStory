const mongoose = require('mongoose');
const { 
        characterSchema, backgroundSchema,
        bgmSchema, soundSchema 
      } = require('./Game_Components');
const { userSchema } = require("./User");

const Schema = mongoose.Schema;

const contributerSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  sceneList: [
    {
      type: String,
    },
  ],
})

const Contributer = mongoose.model("contributer", contributerSchema);

const gameSchema = mongoose.Schema({
  view : {
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
  writer: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
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
}, {timestamps: true})

const Game = mongoose.model('Game', gameSchema);

module.exports = { 
  Game,
  Contributer,
  contributerSchema,
 }