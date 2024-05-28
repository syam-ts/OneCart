const Wallet = require('../models/walletMdl');
const User = require('../models/userMdl');
const Order = require('../models/orderMdl');

//<------------ wallet page -------------->
const getWalletPage = async (req, res) => {
        try {
            const userId = req.session.user;
            const user = await User.findById(userId);
            const wallet = await Wallet.findOne({userId : userId});
            const orders = await Order.find({ userId : userId , $or:[{paymentMethod : "Wallet"},{paymentMethod : "Razor Pay",}], $or:[{status : "Cancelled"}, {status : "Returned"}]});
        
            res.render('wallet',{ wallet ,user ,orders});
        } catch (err) {
            console.log(err.message);
            res.status(500).json({error : true, message: "Internal Server Error"});
        }
};

module.exports ={
    getWalletPage
}