const mongoose = require("mongoose");
const {
    characterSchema,
    backgroundSchema,
    bgmSchema,
    soundSchema,
} = require("./Game_Components");

const Schema = mongoose.Schema;

const nextSceneSchema = mongoose.Schema({
    sceneId: {
        type: Schema.Types.ObjectId,
        ref: "Scene"
    },
    script: {
        type: String,
    },
});

const cutSchema = mongoose.Schema({
    name: {
        type: String,
    },
    script: {
        type: String,
    },
    characterList: [
        {
            type: String,
        },
    ],
    background: {
        type: String,
    },
    bgm: {
        type: Schema.Types,
        ref: "bgm",
    },
    sound: {
        type: Schema.Types,
        ref: "sound",
    },
});

const Cut = mongoose.model("cut", cutSchema);


const sceneSchema = mongoose.Schema({
    gameId: {
        type: Schema.Types.ObjectId,
        ref: "Game",
    },
    writer: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    recommend: {
        type: Number,
        default: 0,
    },
    title: {
        type: String,
        default: "",
    },
    working_num: {
        type: Number,
        default: 0,
    },
    notRecommend: {
        type: Number,
        default: 0,
    },
    depth: {
        type: Number,
        default: 0,
    },
    sceneTmp: {
        emptyNum: {
            type: Number,
            default: 4,
        },
        certificationList: [
            {
                userId: {
                    type: String,
                    ref: "User",
                },
                exp: {
                    type: Date,
                    default: null, 
                },
                timer: {
                    type: Number,
                    default: null,
                },
                isMakingScene: {
                    type: Boolean,
                    default: false, 
                },
            }
        ],
    },
    prevSceneId: {
        type: Schema.Types.ObjectId,
        ref: "Scene",
    },
    nextList: [nextSceneSchema],
    cutList: [cutSchema],
    status: {
        type: Number,
        default: 0, //? 0:껍데기 1:내용이 들어있는 상태
    },
    isFirst: {
        type: Number,
        default: 1,
    },
}, {timestamps: true});

const Scene = mongoose.model("Scene", sceneSchema);

module.exports = {
    Scene,
    sceneSchema,
    Cut,
    cutSchema,
};
