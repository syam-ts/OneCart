require('dotenv').config(); 
const Product = require('../models/productMdl');
const Address = require('../models/addressMdl');
const Order = require('../models/orderMdl');
const Cart = require('../models/cartMdl');
const User = require('../models/userMdl');
const Wallet = require('../models/walletMdl');
const Razorpay = require('razorpay');
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

  /**
         * ! For User order 
                                       **/


 //<------------ razorpay config -------------->
 const razorpay  = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});


//<------------ for razorpay -------------->
const createOrder = async (req, res) => {
    try {
        const totalPrice = req.body.totalPrice;
        const response = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${RAZORPAY_ID_KEY}:${RAZORPAY_SECRET_KEY}`).toString('base64')}`
            },
            body: JSON.stringify({
                "amount": totalPrice,
                "currency": "INR",
                "receipt": "receipt-001"
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



//<------------ for COD and wallet -------------->
const insertOrder = async (req, res) => {
    try {
            const userId = req.session.user;
            const total = req.body.totalPrice;
            const discountPrice = req.body.subTotal - total;
            const paymentMethod = req.body.paymentMethod;
            const addressId = req.body.addressId;
            const address = await Address.findById(addressId);
            const status = 'Processing';
            const tax = 0.00;
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
                     discountPrice : discountPrice,
                     tax: tax,
                     payment : true
                 });
                 await order.save();
                 await Cart.deleteMany({ userId });
                 if(paymentMethod == "Wallet"){
                    const wallet = await Wallet.findOne({userId : userId});
                    wallet.amount -= total; 
                    await wallet.save();
                    console.log('Successfully lower the wallet amount')
                 }
                 res.json({payment : order.payment});
      } catch (err) {
        console.log('Error inserting order:', err);
        res.render('error',{ message : err.message });
     }
};


//<------------ failed payment -------------->

 const paymentFailed = async(req, res) =>{
    try {
            const userId = req.session.user;
            const total = req.body.totalPrice;
            const discountPrice = req.body.subTotal - total;
            const paymentMethod = req.body.paymentMethod;
            const addressId = req.body.addressId;
            const address = await Address.findById(addressId);
            const status = 'PaymentFailed';
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
                     discountPrice : discountPrice,
                     payment : false
                 });
                 await order.save();
                 await Cart.deleteMany({ userId });
                 res.redirect('/orderFailed')
    } catch (err) {
        res.render('error',{ message: err.message });
    };
 } 



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
           case "olderOrders":
               sortQuery = { createdate: 1 };
               break;
           case "recentOrders":
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
        const userId = req.session.user;
        const user = await User.findById(userId);
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        const productId = order.products.map(product => product._id);
        const product = await Product.find({ _id: { $in: productId } });
        const address = await order.address;
        res.render('orderDetailsUser', { user , order, product, address});
    } catch (error) {
        console.log(error.message);
    }
};


//<------------ order success page -------------->
const orderSuccess = async (req, res) => {
    try {
            res.render('orderSuccess');
    } catch (error) {
        console.log(error.message);
    }
};


//<------------ order failed page -------------->
const orderFailed = async (req, res) => {
    try {
            res.render('orderFailed');
    } catch (error) {
        console.log(error.message);
    }
};

//<------------ order cancel for user -------------->
const orderCancel = async (req, res) => {
    try {
        console.log('The body : ',req.body)
        const userId = req.session.user;
        const { orderId, reason } = req.body;
        const order = await Order.findById(orderId);
       
        if (order.paymentMethod === "Razor Pay") {
            const wallet = await Wallet.findOne({ userId: userId });

            if (!wallet) {
                const newWallet = new Wallet({
                    userId: userId,
                    amount: order.total
                });
                await newWallet.save();
            } else {
                wallet.amount += order.total;
                await wallet.save();
            }

            order.status = "Cancelled";
            order.cancelReason = reason;
            await order.save();
            res.redirect('/orderDetailsUser');
            console.log('New wallet created and money added to wallet');
        } else if (order.paymentMethod === "Wallet") {
            const wallet = await Wallet.findOne({ userId: userId });
            if (wallet) {
                wallet.amount += order.total;
                await wallet.save();
            }
            order.status = "Cancelled";
            await order.save();
            res.redirect('/orderDetailsUser');
            console.log("Money added to the wallet");
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};




const returnOrder = async (req, res) => {
    try {
      const { orderId, reason } = req.body;
      const order = await Order.findById(orderId);


      order.return = { return: true, reason: reason };
      await order.save();
    } catch (err) {
        console.log(err.message);
    }
};

const generateInvoice = async (req, res) => {
        try {
            const orderId = req.body.orderId;
            const pageUrl = `${req.protocol}://${req.get('host')}/orderDetailsUser/${orderId}`;
            
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(pageUrl, { waitUntil: 'networkidle0' });
    
            const pdfBuffer = await page.pdf({ format: 'A4' });
            await browser.close();
    
            res.contentType('application/pdf');
            res.send(pdfBuffer);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
};

const repaymentOrder = async (req, res) => {
    try {
        const orderId = req.body.orderId.trim();
        const order = await Order.findById(orderId);
        console.log('The order before : ',order)

        order.status = "processing";
         order.payment = true;
         await order.save();

        console.log('The order after : ',order.payment)
        res.json({payment : order.payment});
      } catch (err) {
        console.log('Error inserting order:', err);
        res.render('error',{ message : err.message });
     }
};

module.exports = {
    createOrder,
    paymentFailed,
    getOrderHistory,
    sortOrdersUser,
    orderDetailsUser,
    insertOrder,
    orderSuccess,
    orderFailed,
    orderCancel,
    returnOrder,
    generateInvoice,
    repaymentOrder
}