const multerS3 = require("multer-s3");
const multer = require("multer");
const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAcessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
});

let characterStorage;
let backgroundStorage;
let bgmStorage;
let soundStorage;

if(process.env.NODE_ENV === "production"){
    characterStorage = multerS3({
        s3: new AWS.S3(),
        bucket: 'iovar',
        key(req, file, cb) {
            cb(null, `character/${Date.now()}${path.basename(file.originalname)}`)
        },
    })
    
    backgroundStorage = multerS3({
        s3: new AWS.S3(),
        bucket: 'iovar',
        key(req, file, cb) {
            cb(null, `background/${Date.now()}${path.basename(file.originalname)}`)
        },
    })
    
    bgmStorage = multerS3({
        s3: new AWS.S3(),
        bucket: 'iovar',
        key(req, file, cb) {
            cb(null, `sound/${Date.now()}${path.basename(file.originalname)}`)
        },
    })
    soundStorage = multerS3({
        s3: new AWS.S3(),
        bucket: 'iovar',
        key(req, file, cb) {
            cb(null, `sound/${Date.now()}${path.basename(file.originalname)}`)
        },
    })

}
else{

} 