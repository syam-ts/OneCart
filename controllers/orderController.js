
const Product = require('../models/productModel');
const Address = require('../models/addressModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

const getOrderHistory = async (req, res) => {
    try {
      
   

       const order = await Order.find()
       const addressId = order.map(item => item.address);
       const productId = order.map(item => item.products);
       
       
       const address = await Address.findById(addressId);
       console.log('THE ADDRSSS; : ',address);

        res.render('orderHistory', { order, address  });
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