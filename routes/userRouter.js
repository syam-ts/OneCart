const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const userController = require('../controllers/userCtrl');
const cartController = require('../controllers/cartCtrl');
const wishlistController = require('../controllers/wishlistCtrl');
const addressController = require('../controllers/addressCtrl');
const orderController = require('../controllers/orderCtrl');
const productController = require('../controllers/productCtrl');
const couponController = require('../controllers/couponCtrl');
var cors = require('cors');
const dotenv = require('dotenv');
const couponModel = require('../models/couponModel');

dotenv.config({path:'./.env'})

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

   //<------------ user routes -------------->
router.get('/login' ,userController.getLogin);
router.post('/login',userController.verifyLogin);
router.get('/signup',userController.getSignup);
router.post('/signup',userController.insertUser);
router.get('/logout' ,(userController.getLogout));
router.get('/home',userController.getHome);
router.get('/verify-otp',userController.verifyOtpLoad);
router.post('/verify-otp',userController.verifyOTP);
router.get('/forgotPassword', userController.getForgotPassword);
router.get('/userProfile',userController.userProfile);
router.get('/userEdit',userController.userEdit);


   //<------------ product routes -------------->
router.get('/product/:id',productController.productDetails);
router.get('/shopping', productController.getShopping);

   //<------------ search routes -------------->
router.get('/search',productController.searchProduct);
router.get('/lowToHigh/:id',productController.getLowToHigh);
 router.get('/HighToLow/:id',productController.getHighToLow);
 router.get('/newArrivals/:id',productController.getnewArrivals);
 router.get('/AtoZ/:id',productController.getAtoZ);
 router.get('/ZtoA/:id',productController.getZtoA);

   //<------------ pagintation -------------->
router.get('/pagination/:id/:cat', productController.getPagination);


   //<------------ userProfile -------------->
router.get('/userAddress',addressController.getUserAddress);
router.get('/addAddress',addressController.getAddAddress);
router.post('/addAddress',addressController.insertAddress);
router.get('/editAddress/:id',addressController.getEditAddress);
router.post('/editAddress/:id',addressController.editAddress);
router.get('/deleteAddress/:id',addressController.deleteAddress);

   //<------------ wishlist routes -------------->
router.get('/wishlist',wishlistController.getwishlist);
router.post('/wishlist',wishlistController.addToWishlist);

   //<------------ cart routes -------------->
router.get('/cart',cartController.getCart);
router.post('/addToCart',cartController.addToCart);
router.get('/removeCart/:id',cartController.removeCart);
router.get('/checkout/:id',cartController.getCheckout);
 
   //<------------ order routes -------------->
router.get('/orderHistory',orderController.getOrderHistory);
router.post('/placeOrder',orderController.insertOrder);
router.post('/verifyOrder',orderController.verifyAndInsertOrder);


      router.post('/create-order', async (req, res) => {
         try {
             const razorpayApiKey = process.env.RAZORPAY_ID_KEY;
             const razorpaySecretKey = process.env.RAZORPAY_SECRET_KEY;
             const totalPrice = req.body.totalPrice;
             const response = await fetch('https://api.razorpay.com/v1/orders', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Basic ${Buffer.from(`${razorpayApiKey}:${razorpaySecretKey}`).toString('base64')}`
                 },
                 body: JSON.stringify({
                     "amount": totalPrice,
                     "currency": "INR",
                     "receipt": "receipt-001"
                 })
             });
             const data = await response.json();
             res.json(data);
         } catch (error) {
             console.error('Error:', error);
             res.status(500).json({ error: 'Internal Server Error' });
         }
     });
     

 router.post('/couponSearch',couponController.couponSearch);




router.get('/orderSuccess',(req, res) => {
    res.render('orderSuccess');
});




router.get('/new', (req, res) => {
   res.render('new')
})



module.exports = router;
