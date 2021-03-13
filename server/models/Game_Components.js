const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playingSchema = mongoose.Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game'
  },
  //?scene아직 안만들었습니다.
  // sceneId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Game'
  // }
})

const Playing = mongoose.model('playing', playingSchema);


const characterSchema = mongoose.Schema({
  name: String,
  image: String 
});

const Character = mongoose.model('character', characterSchema);

const backgroundSchema = mongoose.Schema({
  name: String,
  image: String 
});

const Background = mongoose.model('background', backgroundSchema);

module.exports = {
  Character, characterSchema, 
  Background, backgroundSchema,
  Playing, playingSchema
}



