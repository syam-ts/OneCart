
const Product = require('../models/productModel');
const Address = require('../models/addressModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

const getOrderHistory = async (req, res) => {
    try {
        const userId = req.session.user;
        
        // Fetch orders for the current user
        const orders = await Order.find({ userId });

        // Array to hold order details with products
        const orderDetails = [];

        // Iterate over each order
        for (const order of orders) {
            const address = await Address.findById(order.address);
            
            // Fetch products for the current order
            const productIds = order.products.map(product => product._id);
            const products = await Product.find({ _id: { $in: productIds } });
            
            // Add order details along with products to orderDetails array
            orderDetails.push({ order, products, address });
        }
        console.log('THE ORDERS : ', orderDetails)

        res.render('orderHistory', { orderDetails  });
    } catch (error) {
        console.log(error.message);
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