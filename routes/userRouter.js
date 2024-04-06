const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');
const wishlistController = require('../controllers/wishlistController');
const addressController = require('../controllers/addressConroller');
const orderController = require('../controllers/orderController');
const productController = require('../controllers/productController');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//user actions
router.get('/login' ,userController.getLogin);
router.post('/login',userController.verifyLogin);
router.get('/signup',userController.getSignup);
router.post('/signup',userController.insertUser);
router.get('/logout' ,(userController.getLogout));
router.get('/home',userController.getHome);
router.get('/verify-otp',userController.verifyOtpLoad);
router.post('/verify-otp',userController.verifyOTP);

//product routes
router.get('/product/:id',userController.displayProduct);
router.get('/search',productController.searchProduct);

//userProfile
router.get('/userProfile',addressController.getUserProfile);
router.get('/userAddress',addressController.getUserAddress);
router.get('/addAddress',addressController.getAddAddress);
router.post('/addAddress',addressController.insertAddress);
router.get('/editAddress/:id',addressController.getEditAddress);
router.post('/editAddress/:id',addressController.editAddress);
router.get('/deleteAddress/:id',addressController.deleteAddress);

//wishlist routes
router.get('/wishlist',wishlistController.getwishlist);
router.post('/wishlist',wishlistController.addToWishlist);

//cart routes
router.get('/cart',cartController.getCart);
router.post('/addToCart',cartController.addToCart);
router.get('/removeCart/:id',cartController.removeCart);
router.get('/checkout/:id',cartController.getCheckout);
router.get('/checkout1/new',(req, res) =>{
res.render('chekout1')
});
 
//order routes
router.get('/orderHistory',(req, res) => {
    res.render('orderHistory')
});
router.post('/placeOrder',orderController.insetOrder);


module.exports = router;
