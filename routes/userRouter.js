const express = require('express');
const app = express();
const Router = express.Router();
const bodyParser = require('body-parser');
const userController = require('../controllers/userCtrl');
const cartController = require('../controllers/cartCtrl');
const wishlistController = require('../controllers/wishlistCtrl');
const addressController = require('../controllers/addressCtrl');
const orderController = require('../controllers/orderCtrl');
const productController = require('../controllers/productCtrl');
const categoryController = require('../controllers/categoryCtrl');
const walletController = require('../controllers/walletCtrl');
var cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const {isLoggedIn} = require('../config/auth');

//<------------ multer config -------------->
const storage = multer.diskStorage({ destination:(req, file, cb) => { cb(null,'./public/product_images')  },
    filename:(req, file, cb) => { const name = Date.now()+''+file.originalname; cb(null, name) }});
const upload = multer({ storage });

//<------------ requiring tools -------------->
dotenv.config({path:'./.env'})
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//<------------ user routes -------------->
Router.get('/login' ,userController.getLogin);
Router.post('/login',userController.verifyLogin);
Router.get('/signup',userController.getSignup);
Router.post('/signup',userController.insertUser);
Router.get('/logout' ,(userController.getLogout));
Router.get('/home',userController.getHome);
Router.get('/verify-otp',userController.verifyOtpLoad);
Router.post('/verify-otp',userController.verifyOTP);
Router.get('/forgotPassword', userController.getForgotPassword);
Router.get('/userProfile',userController.userProfile);
Router.get('/userEdit',userController.getUserEdit);
Router.post('/userEdit',upload.single('userImage'),userController.insertUserDetails);
Router.get('/userProfileSidebar',userController.userProfileSidebar);    

   //<------------ product routes -------------->
Router.get('/product/:id',productController.productDetails);
Router.get('/shopping?', productController.getShopping);
Router.get('/sortShopping/:method',productController.sortShoppingPage); 
Router.get('/category/:id',categoryController.categoryShopping);
//Need cross check
Router.post('/sortProduct',productController.sortShoppingPage);

   //<------------ search routes -------------->
Router.get('/search',productController.searchProduct);
Router.get('/lowToHigh/:id',productController.getLowToHigh);


   //<------------ userProfile || address-------------->
Router.get('/userAddress',isLoggedIn, addressController.getUserAddress);
Router.get('/addAddress',isLoggedIn,addressController.getAddAddress);
Router.post('/addAddress',isLoggedIn,addressController.insertAddress);
Router.get('/editAddress/:id',isLoggedIn,addressController.getEditAddress);
Router.post('/editAddress/:id',isLoggedIn,addressController.editAddress);
Router.get('/deleteAddress/:id',isLoggedIn,addressController.deleteAddress);


   //<------------ wishlist routes -------------->
Router.get('/wishlist',wishlistController.getwishlist);
Router.post('/addToWishlist',wishlistController.addToWishlist);


   //<------------ cart routes -------------->
Router.get('/cart',isLoggedIn, cartController.getCart);
Router.post('/addToCart',isLoggedIn, cartController.addToCart);
Router.get('/removeCart/:id',isLoggedIn, cartController.removeCart);
Router.get('/checkout/:id',isLoggedIn, cartController.getCheckout);
Router.post('/cartDec',isLoggedIn, cartController.cartDec);
Router.post('/cartInc',isLoggedIn, cartController.cartInc);
 

   //<------------ order routes -------------->
Router.get('/orderHistory',isLoggedIn, orderController.getOrderHistory);
Router.post('/placeOrder',isLoggedIn, orderController.insertOrder);
Router.post('/verifyOrder',isLoggedIn, orderController.verifyAndInsertOrder);
Router.post('/orderCancel',isLoggedIn, orderController.orderCancel);
Router.get('/orderDetailsUser/:id',isLoggedIn, orderController.orderDetailsUser);
Router.get('/sortOrdersUser/:method',isLoggedIn,orderController.sortOrdersUser);
Router.post('/create-order',isLoggedIn, orderController.createOrder); 
Router.get('/orderSuccess',isLoggedIn, orderController.orderSuccess)



//<------------ wallet routes -------------->
Router.get('/wallet',walletController.getWalletPage);

module.exports = Router;
