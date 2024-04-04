
const Product = require('../models/productModel');
const Address = require('../models/addressModel');
const Order = require('../models/orderModel');

const getOrderHistory = async (req, res) => {
    try {
        const cart = decodeURIComponent(req.params.cart);
        const userId = req.params.user; 
        const address = decodeURIComponent(req.params.address);

        const newOrder = new Order({
            userId: userId, 
            address: address,
            products: cart.products,
            paymentMethod: 'COD', 
            status: 'shipped'
        });

        await newOrder.save();

        console.log('Order successfully inserted:', newOrder);
        res.render('orderHistory');
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

const insetOrder = async (req, res ) => {
    try {
        const userId = req.session.user;
        const address = req.body;
        const total = req.params.totalPrice;
        const paymentMethod = 'COD';
        const status = 'Pending'


    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    getOrderHistory
}