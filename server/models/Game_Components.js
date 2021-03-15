const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playingSchema = mongoose.Schema({
    gameId: {
        type: Schema.Types.ObjectId,
        ref: "Game",
    },
    sceneId: {
        type: Schema.Types.ObjectId,
        ref: "Scene",
    },
});

const Playing = mongoose.model("playing", playingSchema);

const characterSchema = mongoose.Schema({
    name: String,
    image: String,
});

const Character = mongoose.model("character", characterSchema);

const backgroundSchema = mongoose.Schema({
    name: String,
    image: String,
});

const Background = mongoose.model("background", backgroundSchema);

const bgmSchema = mongoose.Schema({
    name: String,
    music: String,
});

const Bgm = mongoose.model("bgm", bgmSchema);

const soundSchema = mongoose.Schema({
    name: String,
    music: String,
});

const Sound = mongoose.model("sound", soundSchema);

module.exports = {
    Playing,
    playingSchema,
    Character,
    characterSchema,
    Background,
    backgroundSchema,
    Bgm,
    bgmSchema,
    Sound,
    soundSchema,
};
