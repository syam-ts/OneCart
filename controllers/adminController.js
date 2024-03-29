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
            res.redirect('/dashboard');
          } else {
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
            console.log('Admin logged in successfully');

            // Wait for database queries to complete before rendering dashboard
            const [usersCount, brandCount, categoryCount] = await Promise.all([
                User.find({ isBlock: false }).count(),
                Product.find({ deleted: false }).count(),
                Category.find({ deleted: false }).count()
            ]); 
            res.render('dashboard', { chart: [usersCount, brandCount, categoryCount] });
        } else {
            res.send('Username or password incorrect');
            console.log('Admin login failed');
        }
    } catch (error) {
        res.send(error.message);
    }
};

//dashboard
const requireAdminAuth = (req, res, next) => {
    if (req.session.admin) {
        next(); // Continue to the next middleware/route if admin is authenticated
    } else {
        res.redirect('./admin-login'); // Redirect to admin login page if not authenticated
    }
};

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
    verifyAdmin,
    logoutAdmin,
    requireAdminAuth
};
