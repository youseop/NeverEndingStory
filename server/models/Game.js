const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = mongoose.Schema({
  game_creater: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  game_title : {
    type: String,
    maxlength: 50
  },
  game_detail : {
    type: String
  },
  game_privacy : {
    type: String
  },
  game_filePath : {
    type: String
  },
  game_thumbnail : {
    type: String
  },
  game_category : {
    type: String
  },
  game_views : {
    type: Number,
    default: 0
  }
}, {timestamps: true})

const Game = mongoose.model('Game', gameSchema);

module.exports = { Game }