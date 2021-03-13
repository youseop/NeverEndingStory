const mongoose = require('mongoose');
const { characterSchema, backgroundSchema } = require('./Game_Components');
const Schema = mongoose.Schema;

const { userSchema } = require("./User");

const gameSchema = mongoose.Schema({
  game_view : {
    type: Number,
    default: 0
  },
  game_title : {
    type: String,
    maxlength: 50
  },
  game_detail : {
    type: String
  },
  game_creater: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  game_writer: [userSchema],
  game_character: [characterSchema],
  game_background: [backgroundSchema],
  game_thumbnail : {
    type: String
  },
  game_category : {
    type: String
  },
  game_privacy : {
    type: String
  },
}, {timestamps: true})

const Game = mongoose.model('Game', gameSchema);

module.exports = { Game }