const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/cartController');
const cartController = require('../controllers/cartController');
const wishlistController = require('../controllers/wishlistController');
const addressController = require('../controllers/addressConroller');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//user actions
router.get('/login' ,userController.getLogin);
router.post('/login',userController.verifyLogin);
router.get('/signup',(req, res) => {res.render('signup')});
router.post('/signup',userController.insertUser);
router.get('/logout' ,(userController.getLogout));
router.get('/home',userController.getHome);
router.get('/verify-otp',userController.verifyOtpLoad);
router.post('/verify-otp',userController.verifyOTP);

//product routes
router.get('/product/:id',userController.displayProduct);
router.get('/search', userController.searchProduct);

//userProfile
router.get('/userProfile',(req, res) => {res.render('userProfile')});
router.get('/userAddress',addressController.getUserAddress);
router.get('/addAddress',addressController.getAddAddress);
router.post('/addAddress',addressController.insertAddress);

//wishlist routes
router.get('/wishlist',wishlistController.getwishlist);
router.post('/wishlist',wishlistController.addToWishlist);

//cart routes
router.get('/cart',cartController.getCart);
router.post('/addToCart',cartController.addToCart);
 


module.exports = router;