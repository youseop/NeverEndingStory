const dotenv = require('dotenv')
dotenv.config()

const sessionOption = {
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false, //! 이후에 true로도 실험 필요 (for https)
    },
}

module.exports = sessionOption