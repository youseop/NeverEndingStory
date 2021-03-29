const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const mongoose = require("mongoose");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        nickname: req.user.nickname,
        role: req.user.role,
        image: req.user.image,
        gameHistory: [],
        makingGameList: req.user.makingGameList,
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.get("/playing-list/clear", auth, async(req,res) =>{
    try {
        const user = await User.findOne({ _id: req.user._id })
        user.gamePlaying = {
            ...user.gamePlaying,
            sceneIdList: user.gamePlaying.sceneIdList.slice(0, 1)
        };
    
        user.save()
        return res.json({
                success: true,
                teleportSceneId: user.gamePlaying.sceneIdList[0]
            })
    }
    catch (err){
        console.log("PLAYING LIST CLEAR FAIL")
        console.log(err)
        return res.json({ success: false, err });
    }
})


router.get("/playing-list/pop", auth, async (req,res) =>{
    try {
        const user = await User.findOne({ _id: req.user._id })
        user.gamePlaying.sceneIdList.pop()
        user.save()
        return res.json({
            success: true,
            teleportSceneId: user.gamePlaying.sceneIdList[user.gamePlaying.sceneIdList.length - 1]
        })
        
    }
    catch (err) {
        console.log("PLAYING LIST POP FAIL")
        console.log(err)
        return res.json({ success: false, err });
    }
})

module.exports = router;
