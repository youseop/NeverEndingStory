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
    description: String,
    marking:Number,
    image_array: [
        {
            type: String,
        },
    ],
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

const contributerSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    userSceneCnt: Number,
    sceneIdList: [String]
});

const Contributer = mongoose.model("contributer", contributerSchema);

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
    Contributer,
    contributerSchema
};