const Wallet = require('../models/walletModel');
const User = require('../models/userModel');

//<------------ wallet page -------------->
const getWalletPage = async (req, res) => {
    try {
        const userId = req.session.user;
        const user = await User.findById(userId);
        console.log('The user: ',user)
        const wallet = await Wallet.findOne({userId : userId});
        console.log('The wallet : ',wallet)
        res.render('wallet',{ wallet ,user });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({error : true, message: "Internal Server Error"});
    }
};

module.exports ={
    getWalletPage

}