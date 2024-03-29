const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const productListing = require('../controllers/productListingController');
const userController = require('../controllers/userController');

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
router.get('/product/:id',productListing.displayProduct);
router.get('/search', productListing.searchProduct);

//userProfile
router.get('/userProfile',(req, res) => {res.render('userProfile')});

//wishlist routes
router.get('/wishlist',(req, res) => {res.render('wishlist')});

//cart routes
router.get('/cart',(req, res) => {res.render('cart')});
 


module.exports = router;