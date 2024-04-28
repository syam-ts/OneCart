const Wallet = require('../models/walletModel');
const User = require('../models/userModel');

//<------------ wallet page -------------->
const getWalletPage = async (req, res) => {
    try {
        const userId = req.session.user;
        const user = await User.findById(userId);
        const wallet = await Wallet.find();
        res.render('wallet',{ wallet ,user });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({error : true, message: "Internal Server Error"});
    }
};


module.exports ={
    getWalletPage

}