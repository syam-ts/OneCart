const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Wallet = require('../models/walletModel');
const Category = require('../models/categoryModel');

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
                  
                    res.render('orderManagement',{
                        orders: orders,
                        totalPage: Math.ceil(count / limit),
                        currentPage: page,
                        previousPage: page > 1 ? page - 1 : 1,
                        nextPage: page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit)
                    });
                
            } catch (err) {
               res.render('error', { message : err.message });
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
        const name = await user.map(x => x.name);
        res.render('salesReport',{ order , email, name});
    } catch (error) {
        console.log(error.message);
    }
};

//<------------ order status changing -------------->
const orderStatusChng = async (req, res) => {
    try {
    
        const {orderStatus , orderId } = req.body;
        const order = await Order.findById(orderId);

        if(order.status == "Processing"){
            if(orderStatus == "Shipped"){
                order.status = "Shipped";
                await order.save();
                res.redirect('/admin/orderManagement');
            }else{
                if(order.paymentMethod == "Razor Pay" || order.paymentMethod == "Wallet"){
                    const userId = order.userId;
                    const total = order.total;
                    const wallet = await Wallet.find({userId : userId});
                    console.log('Enter this',wallet)   
                    if(wallet == undefined){   
                       
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
                     console.log('amount added to the cart')
                 }}
                   const productIds = order.products.map(item => item);
                   const products = await Product.find({ _id: { $in: productIds }});
                   const stocks = products.map(x => x.stock);
                   order.status = orderStatus;
                   await order.save();
                   for (let i = 0; i < stocks.length; i++) {
                       products[i].stock += quantity[i]   
                       await products[i].save();
                   }
                   
                   res.redirect('/admin/orderManagement');
            }
        }else if(order.status == "Shipped"){
                 if(orderStatus == "Delivered"){
                    order.status = "Delivered";
                    await order.save();
                    res.redirect('/admin/orderManagement');
                   } else{
               
                 if(order.paymentMethod == "Razor Pay" || order.paymentMethod == "Wallet"){
                        const userId = order.userId;
                        const total = order.total;
                        const wallet = await Wallet.find({userId : userId});
                        console.log('Enter this',wallet)   
                        if(wallet == undefined){   
                       
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
                     console.log('amount added to the cart')
                 }}
                   const productIds = order.products.map(item => item);
                   const products = await Product.find({ _id: { $in: productIds }});
                   const stocks = products.map(x => x.stock);
                   order.status = orderStatus;
                   await order.save();
                   for (let i = 0; i < stocks.length; i++) {
                       products[i].stock += quantity[i]   
                       await products[i].save();
                   }
                   
                   res.redirect('/admin/orderManagement');
                }
        }else if(order.status == "returnAccepted"){

 
                     order.status = "Returned";
                     await order.save();
                     res.redirect('/admin/orderManagement');


                     if(order.paymentMethod == "Razor Pay" || order.paymentMethod == "Wallet"){
                        const userId = order.userId;
                        const total = order.total;
                        const wallet = await Wallet.find({userId : userId});
                        console.log('Enter this',wallet)   
                        if(wallet == undefined){   
                       
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
                     console.log('amount added to the cart')
                 }}
                   const productIds = order.products.map(item => item);
                   const products = await Product.find({ _id: { $in: productIds }});
                   const stocks = products.map(x => x.stock);
                   order.status = orderStatus;
                   await order.save();
                   for (let i = 0; i < stocks.length; i++) {
                       products[i].stock += quantity[i]   
                       await products[i].save();
                   }
                   
                   res.redirect('/admin/orderManagement');

            }
        
    } catch (error) {
        console.log(error.message);
    }
}


const sortSalesReport = async (req, res) => {
    try {
        console.log('The type : ',req.params)
        const type = req.params.type;
        if(type == "Delevered"){
            const order = await Order.find({ status: { $in: "Delivered" } });
            const userId = await order.map(x => x.userId);
            const user = await User.find({_id:{ $in : userId}})
            const email = await user.map(x => x.email);
            const name = await user.map(x => x.name);
            res.render('salesReport',{ order , email, name});
        }else if(type == "Cancelled"){
            const order = await Order.find({ status: { $in: "Cancelled" } });
            const userId = await order.map(x => x.userId);
            const user = await User.find({_id:{ $in : userId}})
            const email = await user.map(x => x.email);
            const name = await user.map(x => x.name);
            res.render('salesReport',{ order , email, name});
        }
       
    } catch (err) {
        console.log(err.message);
    }
};


//<------------ return accept by admin -------------->
 const returnAccept = async (req, res) => {
    try{
        console.log('REACHED HERE')
        const orderId = req.body.orderId;
        const order = await Order.findById(orderId);
        order.status = "returnAccepted";
        await order.save();
        res.redirect('/admin/orderManagement');
    }catch(err){
        res.render('error',{ message : err.message });
    }
 };


//<------------ return reject by admin -------------->
 const returnReject = async (req, res) => {
    try{
        const orderId = req.body.orderId;
        const order = await Order.findById(orderId);
        order.status = "returnRejected";
        await order.save();
        res.redirect('/admin/orderManagement');
    }catch(err){
        res.render('error',{ message : err.message });
    }
 };


 const orderDaily = async (req, res) => {
    try {
       const orders = await Order.find({}, 'createdate total').lean();
       res.json(orders);
     } catch (err) {
       console.error('Error fetching orders:', err);
       res.status(500).json({ error: 'Internal server error' });
     }
 }
 const orderMonthly = async (req, res) => {
    try {
       const orders = await Order.find({}, 'createdate total').lean();
       res.json(orders);
     } catch (err) {
       console.error('Error fetching orders:', err);
       res.status(500).json({ error: 'Internal server error' });
     }
 }
 const orderYearly = async (req, res) => {
    try {
       const orders = await Order.find({}, 'createdate total').lean();
       res.json(orders);
     } catch (err) {
       console.error('Error fetching orders:', err);
       res.status(500).json({ error: 'Internal server error' });
     }
 }


 const topTenPrdt = async (req, res) => {
    try{
        
        const admin = req.session.admin;
        const users = await User.find({ isBlock: false }).count();
        const brand = await Product.find({ deleted: false }).count();
        const category = await Category.find({ deleted: false }).count();
        const topTenPrdts = await Order.aggregate([ { $unwind: "$products" }, 
        { $group: { _id: "$products._id",
         productName: { $first: "$products.productName" },
          totalOrders: { $sum: 1 } } }, 
          { $sort: { totalOrders: -1 } }] )

          const topTenCtgry = await Order.aggregate([ { $unwind: "$products" }, 
          { $group: { _id: "$products._id",
           category: { $first: "$products.category" },
            totalOrders: { $sum: 1 } } }, 
            { $sort: { totalOrders: -1 } }] )

          const topTenBrnd = await Order.aggregate([ { $unwind: "$products" }, 
          { $group: { _id: "$products._id",
           brand: { $first: "$products.brand" },
            totalOrders: { $sum: 1 } } }, 
            { $sort: { totalOrders: -1 } }] )

            console.log('The brands : ',topTenBrnd)

        if(!admin){
            req.session.destroy();
            res.redirect('./admin-login')
            console.log('Admin not found');
        }else{
            res.render('dashboard', { list:[users,brand,category, topTenPrdts, topTenCtgry]});
        }
        

       
    }catch(err){
        res.render('error',{ message : err.messgae });
    }
 };


 const topTenCtgry = async (req, res) => {
    try{
        
        const admin = req.session.admin;
        const users = await User.find({ isBlock: false }).count();
        const brand = await Product.find({ deleted: false }).count();
        const category = await Category.find({ deleted: false }).count();
        const topTenCtgry = await Order.aggregate([ { $unwind: "$products" }, 
        { $group: { _id: "$products._id",
         category: { $first: "$products.category" },
          totalOrders: { $sum: 1 } } }, 
          { $sort: { totalOrders: -1 } }] )
        if(!admin){
            req.session.destroy();
            res.redirect('./admin-login')
            console.log('Admin not found');
        }else{
            console.log('The cate : ',topTenCtgry)
            res.render('dashboard', { list:[users,brand,category, topTenCtgry]});
        }
        

       
    }catch(err){
        res.render('error',{ message : err.messgae });
    }
 };


  
module.exports = {
    getOrderManagement,
    sortOrderAdmin,
    orderDetailsAdmin,
    getSalesReport,
    orderStatusChng,
    sortSalesReport,
    returnAccept,
    returnReject,
    orderDaily,
    orderMonthly,
    orderYearly,
    topTenPrdt,
    topTenCtgry
};