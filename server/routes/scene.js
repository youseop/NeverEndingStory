const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Scene } = require("../models/Scene");
const { Game } = require("../models/Game");

router.post("/save", async (req, res) => {
    // console.log(123213, req.body);

    const scene = new Scene({
        gameId: req.body.gameId,
        writer: req.body.writer,
        nextList: req.body.nextList,
        cutList: req.body.cutList,
        isFirst: req.body.isFirst,
    });

    for (let i = 0; i < req.body.cutList.length; i++) {
        scene.cutList[i].characterList = [...req.body.cutList[i].characterList];
    }

    scene.save((err, scene) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true, scene });
    });
    const game = await Game.findOne({ _id: scene.gameId });

    if (!game.first_scene) {
        game.first_scene = scene._id;
        game.save();
    }
});

module.exports = router;
