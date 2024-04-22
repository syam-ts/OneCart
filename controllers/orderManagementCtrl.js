const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Wallet = require('../models/walletMode');

const getOrderManagement = async (req, res ) => {
    try {
        const orders = await Order.find(); 
        const userId = orders.address;                                             
        
        res.render('orderManagement',{ orders : orders })
    } catch (error) {
        console.log(error.message);
    }
};


//<------------ load editOrderStatus -------------->
const getEditOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
     const order = await Order.findById(orderId);
     const status = order.status;
     if(status == 'Cancelled'){
        res.redirect('/admin/orderManagement');
        console.log('Cannot edit cancelled order')
     }else{
        if(status == 'Delivered'){
            res.redirect('/admin/orderManagement');
            console.log('Cannot edit Delevered order')
  } else{
        res.render('orderStatus' ,{ order });
     }
     }
       
    
       
    } catch (error) {
        console.log(error.message);
    }
};


const postEditOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const orders = await Order.findById(orderId);
        const productIds = orders.products.map(item => item);
        const products = await Product.find({ _id: { $in: productIds }});
        const carts = orders.carts.map(item => item);
        const stocks = products.map(x => x.stock);
        const quantity = carts.map(x => x.quantity);
        const updatedStatus = req.body.orderStatus;

        if(updatedStatus == 'Cancelled'){
            for (let i = 0; i < stocks.length; i++) {
                console.log('THE PRO: ',products[i].stock)
                products[i].stock += quantity[i]
                
                await products[i].save();
                
            }
        }
      
      

      const updatedFields = {
        status:updatedStatus
      };

      const order = await Order.findByIdAndUpdate( orderId, updatedFields, { new: true });
      if (!order) {
        return res.send('error');
   }
   return res.redirect('/admin/orderManagement');



    } catch (error) {
        console.log(error.message);
    }
};


const orderDetailsAdmin = async (req, res) => {
    try {
        const orderId = req.params.id;
        const orders = await Order.findById( orderId );

        const address = orders.address;
        const userId = orders.userId;
        const user = await User.findById(userId);

        const products = orders.products.map(product => product._id);
        const product = await Product.find({ _id: { $in: products } });




        res.render('orderDetailsAdmin', {  address , product , orders , user })
    } catch (error) {
        console.log(error.message);
    }
};

const getSalesReport = async (req, res) => {
    try {
        const order = await Order.find({status : "Delivered"});
        const userId = await order.map(x => x.userId);
        const user = await User.find({_id:{ $in : userId}})
        const email = await user.map(x => x.email);
        console.log('THE EMAILS : ',email)

        res.render('salesReport',{ order , email});
    } catch (error) {
        console.log(error.message);
    }
};

const orderStatusChng = async (req, res) => {
    try {
        const {orderStatus , orderId } = req.body;
        const order = await Order.findById(orderId);

        if(order.status == "Cancelled"){
            res.redirect('/admin/orderManagement');
            console.log("cannot edit cancelled order")
            res.json({message : "cannot edit cancelled order"})

        }else if(order.status == "Delivered"){
            res.redirect('/admin/orderManagement');
            console.log("cannot edit delivered order")
            res.json({message : "cannot edit delevered order"})
        }else if(order.status == "Pending" ){
            if(orderStatus == "Delivered" || orderStatus == "Shipped"){
              
                 order.status = orderStatus;
               await order.save();
               res.redirect('/admin/orderManagement');
           
            }else if(orderStatus == "Cancelled"){
               const productIds = order.products.map(item => item);
               const products = await Product.find({ _id: { $in: productIds }});
               const carts = order.carts.map(item => item);
               const stocks = products.map(x => x.stock);
               const quantity = carts.map(x => x.quantity);
               order.status = orderStatus;
               await order.save();
               for (let i = 0; i < stocks.length; i++) {
                   products[i].stock += quantity[i]   
                   await products[i].save();
               }

               if(order.paymentMethod == "Razor Pay"){
                const userId = order.userId;
                const total = order.total;
                const wallet = await Wallet.find({userId : userId});
                console.log('Enter this',wallet)   
                if(wallet == undefined){   
                    console.log("FINALLY IT ENTERDN");
                    
                    wallet.amount =+ total;
                    const newWallet = new Wallet({
                        userId : userId,
                        amount : wallet.amount
                    });
                    await newWallet.save();
                    console.log('new wallet created')
                    }else{       
                        
                        
                    await Wallet.findOneAndUpdate(
                        { userId },
                        { $inc: { amount: total } },
                        { new: true }
                    );
                 res.redirect('/admin/orderManagement');
                 console.log('amount added to the cart')
                }
 
               }
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    getOrderManagement,
    getEditOrderStatus,
    postEditOrderStatus,
    orderDetailsAdmin,
    getSalesReport,
    orderStatusChng
};