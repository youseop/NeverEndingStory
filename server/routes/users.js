const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const { User } = require("../models/User");

const { sanitize } = require("../lib/sanitize")
const { auth } = require("../middleware/auth");
const { check } = require("../middleware/check");
const { route } = require('./passport');
const { objCmp } = require('../lib/object');

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

router.post("/register", async (req, res) => {

    const user = new User(req.body);
    user.nickname = sanitize(user.nickname)
    if (req.session.gamePlaying) {
        user.gamePlaying = req.session.gamePlaying
    }
    if (req.session.gameHistory) {
        user.gameHistory = req.session.gameHistory
    }

    //! generateToken includes save
    user.generateToken((err, user) => {
        if (err) return res.status(200).json({ success: false, err });
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token)
            .status(200)
            .json({
                success: true
            })

    })

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




router.post("/playing-list/clear", check, async (req, res) => {
    try {
        let user;
        let nowIsMaking=false;
        const { gameId, sceneId } = req.body
        
        if (req.isMember) {
            user = await User.findOne({ _id: req.user._id })
        }
        else {
            user = req.session
        }
        //isMaking???????????? ????????? ??? ???????????????...(????????? ??? ????????? ???????????? ????????? ???????????? ?????????)
        //! ???????????? -> ???????????? ?????? ( emptyNum ?????? ???)
        //! ?????????????????? -> ?????? ??????
        let prevOfLastScene
        if (objCmp(user.gamePlaying.sceneIdList[user.gamePlaying.sceneIdList.length - 1], sceneId)){
            nowIsMaking = user.gamePlaying.isMaking;
            prevOfLastScene = user.gamePlaying.sceneIdList[user.gamePlaying.sceneIdList.length - 2];
            
            //! ????????? while????????? ??????????????? ????
            let idx = user.makingGameList?.findIndex(item => objCmp(item.sceneId, sceneId))
            while (idx > - 1) {
                user.makingGameList.splice(idx, 1)
                idx = user.makingGameList.findIndex(item => objCmp(item.gameId, gameId))
            }

            
            user.gamePlaying = {
                ...user.gamePlaying,
                isMaking: false,
                sceneIdList: user.gamePlaying.sceneIdList.splice(0, 1)
            };
            if (req.isMember) {
                user.save()
            }
            return res.json({
                success: true,
                teleportSceneId: user.gamePlaying.sceneIdList[0],
                prevOfLastScene,
                nowIsMaking
            })
        }
        else{
            return res.json({
                success:true,
                refresh : true,
            })
        }
    }
    catch (err) {
        console.log(err)
        return res.json({ success: false, err });
    }
})


router.get("/playing-list/pop", check, async (req, res) => {
    try {
        let user;
        if (req.isMember) {
            user = await User.findOne({ _id: req.user._id })
        }
        else {
            user = req.session
        }
        user.gamePlaying.sceneIdList.pop()
        if (req.isMember) {
            user.save()
        }
        return res.json({
            success: true,
            teleportSceneId: user.gamePlaying.sceneIdList[user.gamePlaying.sceneIdList.length - 1]
        })

    }
    catch (err) {
        return res.json({ success: false, err });
    }
})

router.post("/profile", (req, res) => {
    User.findOne({ _id: req.body.userId }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
        return res.status(200).send({
            success: true,
            user: user
        });
    });
});


router.post("/nickname-check", (req, res) => {
    User.findOne({ nickname: req.body.nickname }, (err, user) => {
        if (err) return res.json({ success: false, err });
        if (!user)
            return res.status(200).send({
                success: true,
                usedNickname: false
            });
        return res.status(200).send({
            success: true,
            usedNickname: true
        });
    });
});

router.post("/email-check", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.json({ success: false, err });
        if (!user)
            return res.status(200).send({
                success: true,
                usedEmail: false
            });
        return res.status(200).send({
            success: true,
            usedEmail: true
        });
    });
});

router.get("/visit", check, (req, res) => {
    let gamePlaying = req.isMember ? req.user.gamePlaying : req.session.gamePlaying;
    return res.status(200).send({
        success: true,
        gamePlaying,
    })
})

router.post("/send-feedback", async (req, res) => {
    const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD
        },
    });

    let info = await transporter.sendMail({
        from: "????????? ?????? ????????????",
        to: "chotjd329@hotmail.com, daejjyu@gmail.com, edlsw@naver.com, stkang9409@gmail.com, jeongws3240@gmail.com",
        subject: `[?????????] ?????? ?????? ?????? - (${req.body.Type})`,
        text: `${req.body.Content}\n\n?????????1: ${req.body.Email}\n?????????2: ${req.body.PhoneNumber}`
    });

    if (info.rejected.length) {
        return res.status(200).send({
            success: false,
        });
    }
    return res.status(200).send({
        success: true,
    });
});

router.delete('/contribute-game/:gameId/:userId', async (req,res) => {
    try{
        const {gameId, userId} = req.params;
        User.updateOne(
            {_id: userId},
            {$pull: { contributedGameList: {gameId: gameId} }}
        ).exec();
        return res.status(200).send({ success: true });
    } catch (err) {
        return res.status(400).send({ success: false });
    }
}) 

router.delete('/contribute-scene/:gameId/:userId', async (req,res) => {
    try{
        const {gameId, userId} = req.params;
        User.updateOne(
            {_id: userId},
            {$pull: { contributedSceneList: {gameId: gameId} }}
        ).exec();
        return res.status(200).send({ success: true });
    } catch (err) {
        return res.status(400).send({ success: false });
    }
})

module.exports = router;
