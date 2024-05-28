const session = require('express-session');
const User = require('../models/userMdl');
const Product = require('../models/productMdl');
const Category = require('../models/categoryMdl');
const Order = require('../models/orderMdl');
const dotenv = require('dotenv');
const express = require('express');
const app = express();
dotenv.config({path:'./.env'})

//<------------ session congig -------------->
const secretKey = process.env.SESSION_SECRET;
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 36000000 }, 
}));

//<------------ get admin login -------------->
const getAdmin = (req, res) => {
    try {
        if (req.session.admin) {
          
            res.redirect('./dashboard');
          } else {
            console.log('SESSION; ',req.session.admin);
            res.render('admin-login');
        }
    } catch (err) {
        res.render('error',{ message : err.message });
    }
};

//<------------ admin authuntication -------------->
const adminCredentials  = {
    UserName: "adminMain",
    Password: "admin123"
};

//<------------ verify admin -------------->
const verifyAdmin = async (req, res) => {
    try {
        const limit = 10;
        if (req.body.userName == adminCredentials.UserName) {

            if(req.body.password == adminCredentials.Password){
                req.session.admin = true;
                req.session.adminUserName = adminCredentials.UserName;
                res.redirect('/admin/dashboard')
            }else{
                res.redirect('/admin/admin-login?message=INVALID PASSWORD&type=error');
            }
        }else{
            res.redirect('/admin/admin-login?message=INVALID USERNAME&type=error');
        }

    } catch (err) {
        res.render('error',{ message : err.message });
    }
};


//<------------ dashboard -------------->
const getDashboard =  async (req, res) => {
    try {
        const admin = req.session.admin;
        const limit = 10;
        const [users, brand, category] = await Promise.all([
            User.countDocuments({ isBlock: false }),
            Product.countDocuments({ deleted: false }),
            Category.countDocuments({ deleted: false })
        ]);
        

        const topTenPrdts = await Order.aggregate([ { $unwind: "$products" }, 
        { $group: { _id: "$products._id",
         productName: { $first: "$products.productName" },
          totalOrders: { $sum: 1 } } }, 
          { $sort: { totalOrders: -1 } }, {$limit : limit}] );

          const topTenCtgry = await Order.aggregate([ { $unwind: "$products" }, 
          { $group: { _id: "$products.category",
            totalOrders: { $sum: 1 } } }, 
            { $sort: { totalOrders: -1 }}, {$limit : 3}] );


            const topTenBrnd = await Order.aggregate([ { $unwind: "$products" }, 
            { $group: { _id: "$products._id",
             brand: { $first: "$products.brand" },
              totalOrders: { $sum: 1 } } }, 
              { $sort: { totalOrders: -1 }}, {$limit : limit}] );
  
              console.log('The products : ',topTenCtgry)
        if(!admin){
            req.session.destroy();
            res.redirect('./admin-login')
            console.log('Admin not found');
        }else{
            res.render('dashboard', { list:[ users, brand, category, topTenPrdts, topTenCtgry, topTenBrnd] });
        }
       
    } catch (err) {
        res.render('error',{ message : err.message });
    }
};


//<------------ admin logout -------------->
const logoutAdmin = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.send('Error destroying session');
            } else {
                res.redirect('/admin/admin-login?message=Loggedout Successfully&type=success'); 
                console.log('Admin logged out successfully');
            }
        });
    } catch (err) {
        res.render('error',{ message : err.message });
    }
};


const topTenPrdt = async (req, res) => {
    try {
        const result = await Order.aggregate([
            { $unwind: "$products" },
            { $group: { _id: "$products.productName", count: { $sum: 1 } } }, 
            { $sort: { count: -1 } }, 
            { $limit: 3 } 
        ]);
        
        console.log('The pro : ',result)
        res.json(result);
    } catch (err) {
        res.render('error',{ message : err.message });
    }
}


module.exports = {
    getAdmin,
    getDashboard,
    verifyAdmin,
    logoutAdmin
};
