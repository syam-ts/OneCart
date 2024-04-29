
const Product = require('../models/productModel');
const Address = require('../models/addressModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const Wallet = require('../models/walletModel');
const Razorpay = require('razorpay');
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

//<------------ order history -------------->
const getOrderHistory = async (req, res) => {
    const userId = req.session.user;
    try {

        var page = 1;
        const limit = 8;
        if (req.query.page) {
            page = parseInt(req.query.page);
        }
        const orders = await Order.find({ userId })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const user = await User.findOne({ _id: userId });
        const address = orders.length > 0 ? orders[0].address : null;
        const products = orders.flatMap(order => order.products.map(product => product._id));
        const product = await Product.find({ _id: { $in: products } });
       const total = orders.map( x => x.total);

       console.log('THe pro : ',product)

        
      
        const count = await Order.find({ deleted: false }).countDocuments();
      
        res.render('orderHistory', {
            address : address,
            user : user,
            total : total,
            orders: orders,
            products: product,
            totalPage: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page > 1 ? page - 1 : 1,
            nextPage: page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit)
        });






    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
};

const sortOrdersUser = async (req , res) => {
    try {
        const sortMethod = req.params.method;
        var sortQuery = {}; 
   
        switch (sortMethod) {
           case "recentOrders":
               sortQuery = { createdate: 1 };
               break;
           case "olderOrders":
               sortQuery = { createdate: -1 };
               break;
           default:
               sortQuery = {};
       }

       var page = 1;
       const limit = 8;
       if (req.query.page) {
           page = parseInt(req.query.page);
       }

       const userId = req.session.user;
       const orders = await Order.find({ userId })
           .limit(limit * 1)
           .skip((page - 1) * limit)
           .sort(sortQuery) 
           .exec();

       
       const user = await User.findOne({ _id: userId });
       const address = orders.length > 0 ? orders[0].address : null;
       const products = orders.flatMap(order => order.products.map(product => product._id));
       const product = await Product.find({ _id: { $in: products } });
       const total = orders.map( x => x.total);
       const count = await Order.find({ userId }).countDocuments();

            res.render('orderHistory', {
                address : address,
                user : user,
                total : total,
                orders: orders,
                products: product,
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page > 1 ? page - 1 : 1,
                nextPage: page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit)
            });
        
    } catch (error) {
        console.log(error.message);
    }
};

//<------------ order details user -------------->
const orderDetailsUser = async (req, res) => {
    try {
        const user = req.session.user;
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        const productId = order.products.map(product => product._id);
        const product = await Product.find({ _id: { $in: productId } });
        const address = await order.address
        console.log('The Address : ',address)
        res.render('orderDetailsUser', { user , order, product, address});
    } catch (error) {
        console.log(error.message);
    }
};


//<------------ razorpay config -------------->
const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

//<------------ insert order -------------->
const insertOrder = async (req, res) => {
    try {
            const userId = req.session.user;
            const address = await Address.findOne({ userId });
            const total = req.body.totalPrice;
            const discountPrice = req.body.subTotal - total;
            console.log('The discount Price : ',discountPrice)
            const paymentMethod = req.body.paymentMethod;
             const status = 'Pending';
             const cart = await Cart.find({ userId });
             const productIds = cart.map(item => item.productId);
             const products = await Product.find({ _id: { $in: productIds } });
                 const order = new Order({
                     userId: userId,
                     address: address,
                     products: products,
                     total: total,
                     paymentMethod: paymentMethod,
                     status: status,
                     carts: cart,
                     discountPrice : discountPrice
                 });
                 await order.save();
                 await Cart.deleteMany({ userId });
                 if(paymentMethod == "Wallet"){
                    const wallet = await Wallet.findOne({userId : userId});
                    wallet.amount -= total; 
                    await wallet.save();
                    console.log('Successfully lower the wallet amount')
                 }
                 res.redirect('/orderSuccess');
    } catch (error) {
        console.error('Error inserting order:', error);
        res.status(500).send('Error inserting order');
    }
};

//<------------ verifiying order -------------->
const verifyAndInsertOrder = async (req, res) => {
    try {
        const userId = req.session.user;
        const address = await Address.findOne({ userId });
         const paymentMethod = req.body.paymentMethod;
         const status = 'Pending';
         const cart = await Cart.find({ userId });
         const productIds = cart.map(item => item.productId);
         const total = req.body.totalPrice
         const products = await Product.find({ _id: { $in: productIds } });

         const order = new Order({
             userId: userId,
             address: address,
             products: products,
             total: total,
             paymentMethod: paymentMethod,
             status: status,
             carts: cart
         });
         await order.save();
         await Cart.deleteMany({ userId });
         const randomOrderId = await Order.aggregate([{ $sample: { size: 1 } }]).then(result => result[0]._id);

        const amount = req.body.totalPrice*100
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'recipt-001'
        }
        console.log('the amout ',amount)
        razorpayInstance.orders.create(options, 
            (err, order)=>{
                if(!err){
                    res.status(200).send({
                        success:true,
                        msg:'Order Created',
                        order_id:randomOrderId,
                        amount:amount,
                        key_id:RAZORPAY_ID_KEY,
                        // product_name:req.body.name,
                        // description:req.body.description,
                        contact:"8567345632",
                        name: "Sandeep Sharma",
                        email: "sandeep@gmail.com"
                    });
                }
                else{
                    res.status(400).send({success:false,msg:'Something went wrong!'});
                }
            });
    } catch (error) {
        console.log(error.message);
    }
};

//<------------ order cancel for user -------------->
const orderCancel = async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const order = await Order.findById(orderId);
        order.status = "Cancelled";
        await order.save();
        res.redirect('/orderDetailsUser')
        if(order.paymentMethod == "Razor Pay" || order.paymentMethod == "Wallet"){
            console.log('Money refunded to wallet');
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    getOrderHistory,
    sortOrdersUser,
    orderDetailsUser,
    insertOrder,
    verifyAndInsertOrder,
    orderCancel  
}