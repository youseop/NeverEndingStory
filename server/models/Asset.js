const mongoose = require('mongoose');
const {
    characterSchema, backgroundSchema,
    bgmSchema, soundSchema, contributerSchema
} = require('./Game_Components');

const Schema = mongoose.Schema;

const assetSchema = mongoose.Schema({

    assetType: {
        type: String,
    },
    writer: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        nickname: String,
    },
    character: {
        type: characterSchema,
    },
    background: {
        type: backgroundSchema,
    },
    bgm: {
        type: bgmSchema,
    },
    sound: {
        type: soundSchema,
    }
})

const Asset = mongoose.model('Asset', assetSchema);

module.exports = {
    Asset,
}