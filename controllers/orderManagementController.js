const Order = require('../models/orderModel');


const getOrderManagement = async (req, res ) => {
    try {
        const orders = await Order.find();                                                
        
        res.render('orderManagement',{ orders })
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    getOrderManagement
};