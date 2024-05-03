const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Wallet = require('../models/walletModel');

//<------------ order management -------------->
const getOrderManagement = async (req, res ) => {
            try {
                var page = 1;
                    const limit = 5;
                    if (req.query.page) {
                        page = parseInt(req.query.page);
                    }
                     
                    const orders = await Order.find()
                        .limit(limit * 1)
                        .skip((page - 1) * limit)
                        .exec();
                  
                    const count = await Order.find().countDocuments();
                  
                    res.render('orderManagement', {
                        orders: orders,
                        totalPage: Math.ceil(count / limit),
                        currentPage: page,
                        previousPage: page > 1 ? page - 1 : 1,
                        nextPage: page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit)
                    });
                
            } catch (error) {
               console.log(error);
               res.status(500).send('Server internal Error');
      }   
};

//<------------ sort admin order -------------->

const sortOrderAdmin = async (req, res) => {
    try {
        const sortMethod = req.params.method;
        console.log('THE METHOD : ',sortMethod)
        var sortQuery = {}; 
   
        switch (sortMethod) {
           case "recentOrders":
               sortQuery = { createdate: -1 };
               break;
           case "recentOrders":
               sortQuery = { createdate: 1 };
               break;
           default:
               sortQuery = {};
       }

       if(sortMethod == "deleveredOrders"){
        var page = 1;
            const limit = 5;
            if (req.query.page) {
                page = parseInt(req.query.page);
            }
          
            const orders = await Order.find({status : "Delivered"})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
          
            const count = await Order.find({status : "Delivered"}).countDocuments();
            
            res.render('orderManagement', {
                orders: orders,
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page > 1 ? page - 1 : 1,
                nextPage: page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit)
            });
        
       }


            var page = 1;
            const limit = 5;
            if (req.query.page) {
                page = parseInt(req.query.page);
            }
          
            const orders = await Order.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort(sortQuery) 
                .exec();
          
            const count = await Order.find().countDocuments();

            console.log('The order : ',orders)
          

            res.render('orderManagement', {
                orders: orders,
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page > 1 ? page - 1 : 1,
                nextPage: page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit)
            });
        
    } catch (error) {
        console.log(error.message);
    }
}


//<------------ order details for admin -------------->
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

//<------------ sales report -------------->
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

//<------------ order status changing -------------->
const orderStatusChng = async (req, res) => {
    try {
        const {orderStatus , orderId } = req.body;
        const order = await Order.findById(orderId);


      if(order.status == "Cancelled"){
        res.redirect('/admin/orderManagement');
        console.log("cannot edit cancelled order")
      }else if(order.status == "Delivered"){
            res.redirect('/admin/orderManagement');
            console.log("cannot edit delivered order")
            res.json({message : "cannot edit delevered order"})
        }else if(order.status == "Processing" ){
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

               if(order.paymentMethod == "Razor Pay" || order.paymentMethod == "Wallet"){
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
    sortOrderAdmin,
    orderDetailsAdmin,
    getSalesReport,
    orderStatusChng
};