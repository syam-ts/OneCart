const Order = require('../models/orderModel');


const getOrderManagement = async (req, res ) => {
    try {
        const orders = await Order.find();
        console.log('THE ORDERS: ',orders);                                                 
        
        res.render('orderManagement',{ orders })
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    getOrderManagement
};