
const Product = require('../models/productModel');
const Address = require('../models/addressModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');

const getOrderHistory = async (req, res) => {
    const userId = req.session.user;
    try {
        const user = await User.findOne({ _id: userId });
        const orders = await Order.find({ userId });
        const address = orders.length > 0 ? orders[0].address : null;
        
        const products = orders.flatMap(order => order.products.map(product => product._id));
       
        const product = await Product.find({ _id: { $in: products } });
       const total = orders.map( x => x.total);
      
        res.render('orderHistory', {  address, product, user ,total, orders});
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
    
};



       

const insertOrder = async (req, res) => {
    try {
        const userId = req.session.user;
        const address = await Address.findOne({ userId:{ $in : userId } });
        const total = req.body.totalPrice;
        const paymentMethod = 'COD';
        const status = 'Pending';
        const cart = await Cart.find();
        const productIds = cart.map(item => item.productId);

        const productss = await Product.find({ _id: { $in: productIds } });

        const order = new Order({
            userId: userId,
            address: address,
            products: productss,
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