//! check whether a member or not

const { User } = require('../models/User');

let check = (req, res, next) => {
    let token = req.cookies.w_auth;
    let isMember = false;

    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if(user){
            req.user = user;
            isMember = true;
        }
        req.isMember = isMember;
        next();
    });
};

module.exports = { check };
