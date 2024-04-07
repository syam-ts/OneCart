
const Product = require('../models/productModel');
const Address = require('../models/addressModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

const getOrderHistory = async (req, res) => {
    try {
       const products = await Product.find();
       const address = await Address.find()

       const order = await Order.find()
       console.log('THE ORDER HISTORY', order.address);

        res.render('orderHistory', { order });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};



       

const insertOrder = async (req, res) => {
    try {
        const userId = req.session.user;
        const address = req.body.addressId;
        const total = req.body.totalPrice;
        const paymentMethod = 'COD';
        const status = 'Pending';
        const cart = await Cart.find();
        const productIds = cart.map(item => item.productId);

        const order = new Order({
            userId: userId,
            address: address,
            products: productIds,
            total: total,
            paymentMethod: paymentMethod,
            status: status
        });
        await order.save();
        await Cart.deleteMany();
        console.log('Order saved successfully:');
        res.redirect('/orderSuccess');
    } catch (error) {
        console.error('Error inserting order:', error);
        res.status(500).send('Error inserting order');
    }
};


module.exports = {
    getOrderHistory,
    insertOrder
}