const session = require('express-session');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

// Session setup
const sessionMiddleware = session({
    secret: 'your-secret-key', // Change this to a secure key for production
    resave: false,
    saveUninitialized: true
});

//get admin-login
const getAdmin = (req, res) => {
    try {
        if (req.session.admin) {
          
            res.redirect('./dashboard');
          } else {
            console.log('SESSION; ',req.session.admin);
            res.render('admin-login');
        }
    } catch (error) {
        console.log(error.message);
        res.send('An error occurred');
    }
};

//admin authentication
const admin = {
    UserName: "adminMain",
    Password: "admin123"
};

// verify admin
const verifyAdmin = async (req, res) => {
    try {
        if (req.body.userName == admin.UserName && req.body.password == admin.Password) {
            req.session.admin = true; 
            const [usersCount, brandCount, categoryCount] = await Promise.all([
                User.find({ isBlock: false }).count(),
                Product.find({ deleted: false }).count(),
                Category.find({ deleted: false }).count()
            ]); 
            // Redirect to the dashboard after successful login
            res.redirect('/admin/dashboard');
        } else {
            // If login fails, stay on the same page and display an error message
            res.render('admin-login');
            console.log('Admin login failed');
        }
    } catch (error) {
        res.send(error.message);
    }
};


//dashboard
const getDashboard =  async (req, res) => {
    try {
        const users = await User.find({ isBlock: false }).count();
        const brand = await Product.find({ deleted: false }).count();
        const category = await Category.find({ deleted: false }).count();
        const admin = req.session.admin;
        if(!admin){
            res.redirect('./admin-login')

        }else{
            res.render('dashboard',{
                chart:[users,brand,category]
            })
        }
        res.render('dashboard');
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Internal Server Error');
    }
};

//dashboard
// const requireAdminAuth = (req, res, next) => {
//     if (req.session.admin) {
//         next(); // Continue to the next middleware/route if admin is authenticated
//     } else {
//         res.redirect('./dahsboard'); 
//     }
// };

// Admin logout
const logoutAdmin = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.send('Error destroying session');
            } else {
                res.redirect('./admin-login'); // Redirect to admin login page after logout
                console.log('Admin logged out successfully');
            }
        });
    } catch (error) {
        console.error('Error logging out admin:', error);
        res.send('An error occurred');
    }
};

module.exports = {
    getAdmin,
    getDashboard,
    verifyAdmin,
    logoutAdmin
};
