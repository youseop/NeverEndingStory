const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const characterSchema = mongoose.Schema({
  name: String,
  subject: String 
});

const Character = mongoose.model('character', characterSchema);

const backgroundSchema = mongoose.Schema({
  name: String,
  subject: String 
});

const Background = mongoose.model('background', backgroundSchema);

module.exports = {
  Character, characterSchema, 
  Background, backgroundSchema
}

