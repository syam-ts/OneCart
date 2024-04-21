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
router.get('/userProfile',addressController.getUserProfile);
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

router.get('/orderSuccess',(req, res) => {
    res.render('orderSuccess');
});


router.get('/new', (req, res) => {
   res.render('new')
})



module.exports = router;
