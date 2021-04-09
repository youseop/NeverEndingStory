const dotenv = require('dotenv');
const express = require("express");
const path = require("path");
dotenv.config();
const { Game } = require("../../models/Game");
const { User } = require("../../models/User");
const mongoose = require("mongoose");

const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAcessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
});

let storage;
if (process.env.NODE_ENV === 'production') {
    storage = multerS3({
        s3: new AWS.S3(),
        bucket: 'iovar',
        key(req, file, cb) {
            cb(null, `uploads/${Date.now()}${path.basename(file.originalname)}`)
        },
    })
} else {
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/");
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}_${file.originalname}`);
        },
    });
}

// uploadFilter 정의
const uploadFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, true);
};

const upload = multer({
    fileFilter: uploadFilter,
    storage: storage,
}).array('files')


async function getRank(gameId){
  const gameDetail = await Game.findOne(
      { _id: gameId },
      { _id: 0, sceneCnt: 1, contributerList: 1 }
  )
  const contributerList = gameDetail.contributerList;
  const contributerCnt = contributerList.length;
  contributerList.sort(function (a, b) {
      return a.userSceneCnt < b.userSceneCnt ? 1 : a.userSceneCnt > b.userSceneCnt ? -1 : 0;
  });
  const topRank = contributerList.slice(0, 5);

  for (let i = 0; i < topRank.length; i++) {
      const user = await User.findOne({ _id: mongoose.Types.ObjectId(topRank[i].userId) })
      topRank[i] = {
          nickname: user.nickname,
          email: user.email,
          image: user.image,
          userId: user._id,
          userSceneCnt: topRank[i].userSceneCnt,
          sceneIdList: topRank[i].sceneIdList
      }
  }
  const sceneCnt = gameDetail.sceneCnt;
  return {topRank, contributerCnt, sceneCnt};
}

async function getDetail(gameId){
  const gameDetail = await Game.findOne({ _id: gameId }).populate("creator");
  return {gameDetail}
}

module.exports = { getRank, getDetail };