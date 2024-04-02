const Order = require('../models/orderModel');
const { route } = require('../routes/adminRouter');

const getOrderManagement = async (req, res ) => {
    try {
        res.render('orderManagement');
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    getOrderManagement
};