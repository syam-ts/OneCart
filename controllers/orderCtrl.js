
const Product = require('../models/productModel');
const Address = require('../models/addressModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const Razorpay = require('razorpay');
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

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

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

const insertOrder = async (req, res) => {
    try {
      
        console.log('THE BODY:',req.body)
        

        const userId = req.session.user;
        const address = await Address.findOne({ userId });
        const total = req.body.totalPrice;
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
                 carts: cart
             });
             await order.save();
             await Cart.deleteMany({ userId });
             res.redirect('/orderSuccess');
            
        
    } catch (error) {
        console.error('Error inserting order:', error);
        res.status(500).send('Error inserting order');
    }
};


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
            }
        );


    } catch (error) {
        console.log(error.message);
    }
};




module.exports = {
    getOrderHistory,
    insertOrder,
    verifyAndInsertOrder  
}