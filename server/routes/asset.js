const express = require('express');
const router = express.Router();
const { Asset } = require("../models/Asset");


//=================================
//             Assets
//=================================


//! 에셋에 있는 캐릭터를 불러온다.
router.get("/:assetType", async (req, res) => {
    const {assetType} = req.params

    try {
        const asset = await Asset.find({ assetType: assetType })
        if (asset) {
            res.json({success: true, asset : asset})
        }
        else {
            res.json({success: false})
        }
    }
    catch (err) {
        console.log(err)
        res.json({ success: false })
    }

})

router.post("/", async (req,res) => {
    Asset.insertMany(req.body.assetList, (err, docs) => {
        if(err){
            res.json({success:false})
        }
        else{
            res.json({success:true})
        }
    })
    //! upload asset

})
module.exports = router;
