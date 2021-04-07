const express = require('express');
const router = express.Router();
const { User } = require("../models/User");


const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy


//=================================
//             Passport
//=================================

// passport.use(new KakaoStrategy({
//     clientID: process.env.KAKAO_ID,
//     callbackURL: "/passport/kakao/oauth"
// },
//     async (accessToken, refreshToken, profile, done) => {
//         console.log("PROFILE ID ", profile.id, typeof profile.id)
//         try {
//             const user = User.findOne({ snsId: profile.id, snsProvider: 'kakao' })
//             if (user) {
//                 done(null, user);
//             }
//             else {
//                 //! 닉네임을 설정해주세요
//                 let newUser = { snsId: profile.id, snsProvider: 'kakao' }
//                 done(null, newUser)
//             }
//         }
//         catch (err) {
//             console.log(err)
//             done(err)
//         }
//     })
// ) 

// router.get("/kakao" , passport.authenticate('kakao'))

//! profile.id 로 식별하기
router.post("/:snsProvider/oauth", async (req, res) => {
    const snsId = req.body.profile.id
    const {snsProvider} = req.params
    try { 
        const user = await User.findOne({ snsId: snsId, snsProvider: snsProvider })
        if (user) {
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        success: true, newUser:false
                    });
            })
        }
        else {
            //! 닉네임을 설정해주세요 
            res.json({ success: true, newUser: true })
        }
    }
    catch (err) {
        console.log(err)
        res.json({ success: false})

    }
})

// router.get("/passport/naver" , (req,res) => {

// })

// router.get("/passport/facebook" , (req,res) => {

// })



module.exports = router;
