const User = require('../models/userMdl');

const isLoggedIn = async (req, res, next) => {
    try {
        if(req.session.user){
            User.findOne({_id : req.session.user}).lean()
            .then((data) => {
                if(data.isBlock == false) {
                    next()
                }else{
                    res.redirect('/login');
                }
            })
        }else{
            res.redirect('/login');
        }
        
    } catch (error) {
        console.log(error.message);
    }
};

const isGoogleAuth = async(req, res) => {
    try {
        if(req.user){
            
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLoggedIn
}