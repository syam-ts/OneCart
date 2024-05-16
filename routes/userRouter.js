const express = require('express');
const app = express();
const Router = express.Router();
const bodyParser = require('body-parser');
const userCtrl = require('../controllers/userCtrl');
const cartCtrl = require('../controllers/cartCtrl');
const wishlistCtrl = require('../controllers/wishlistCtrl');
const addressCtrl = require('../controllers/addressCtrl');
const orderCtrl = require('../controllers/orderUserCtrl');
const productCtrl = require('../controllers/productCtrl');
const categoryCtrl = require('../controllers/categoryCtrl');
const walletCtrl = require('../controllers/walletCtrl');
var cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const {isLoggedIn} = require('../config/auth');
const passport = require('passport');
require('../config/passport');

Router.use(passport.initialize());
Router.use(passport.session());

Router.get('/auth/google',passport.authenticate('google',{scope: [ 'email', 'profile' ]}));
Router.get('/auth/google/callback',
passport.authenticate( 'google',{ successRedirect: '/home', failureRedirect: '/login'}))

// successRedirect: '/home?message=Succesfully LoggedIn&type=success',




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
Router.get('/login' ,userCtrl.getLogin);
Router.post('/login',userCtrl.verifyLogin);
Router.get('/signup',userCtrl.getSignup);
Router.post('/signup',userCtrl.insertUser);
Router.get('/logout' ,(userCtrl.getLogout));
Router.get('/home',userCtrl.getHome);
Router.get('/verify-otp',userCtrl.verifyOtpLoad);
Router.post('/verify-otp',userCtrl.verifyOTP);
Router.get('/forgotPassword', userCtrl.getForgotPassword);
Router.get('/userProfile',userCtrl.userProfile);
Router.get('/userEdit',userCtrl.getUserEdit);
Router.post('/userEdit',upload.single('userImage'),userCtrl.insertUserDetails);
Router.get('/userProfileSidebar',userCtrl.userProfileSidebar);    

   //<------------ product routes -------------->
Router.get('/product/:id', isLoggedIn, productCtrl.productDetails);
Router.get('/shopping?', isLoggedIn,  productCtrl.getShopping);
Router.get('/sortShopping/:method', isLoggedIn, productCtrl.sortShoppingPage); 
Router.get('/category/:id', isLoggedIn, categoryCtrl.categoryShopping);
//Need cross check
Router.post('/sortProduct',productCtrl.sortShoppingPage);

   //<------------ search routes -------------->
Router.get('/search',productCtrl.searchProduct);
Router.get('/lowToHigh/:id',productCtrl.getLowToHigh);


   //<------------ userProfile || address-------------->
Router.get('/userAddress',isLoggedIn, addressCtrl.getUserAddress);
Router.get('/addAddress',isLoggedIn,addressCtrl.getAddAddress);
Router.post('/addAddress',isLoggedIn,addressCtrl.insertAddress);
Router.get('/editAddress/:id',isLoggedIn,addressCtrl.getEditAddress);
Router.post('/editAddress/:id',isLoggedIn,addressCtrl.editAddress);
Router.get('/deleteAddress/:id',isLoggedIn,addressCtrl.deleteAddress);


   //<------------ wishlist routes -------------->
Router.get('/wishlist',wishlistCtrl.getwishlist);
Router.post('/addToWishlist',wishlistCtrl.addToWishlist);
Router.post('/removeWishlist',wishlistCtrl.removeWishlist);


   //<------------ cart routes -------------->
Router.get('/cart',isLoggedIn, cartCtrl.getCart);
Router.post('/addToCart',isLoggedIn, cartCtrl.addToCart);
Router.get('/removeCart/:id',isLoggedIn, cartCtrl.removeCart);
Router.get('/checkout/:id',isLoggedIn, cartCtrl.getCheckout);
Router.post('/cartDec',isLoggedIn, cartCtrl.cartDec);
Router.post('/cartInc',isLoggedIn, cartCtrl.cartInc);
 

   //<------------ order routes -------------->
Router.get('/orderHistory',isLoggedIn, orderCtrl.getOrderHistory);
Router.post('/placeOrder',isLoggedIn, orderCtrl.insertOrder);
Router.post('/orderCancel',isLoggedIn, orderCtrl.orderCancel);
Router.get('/orderDetailsUser/:id',isLoggedIn, orderCtrl.orderDetailsUser);
Router.get('/sortOrdersUser/:method',isLoggedIn,orderCtrl.sortOrdersUser);
Router.post('/create-order',isLoggedIn, orderCtrl.createOrder);
Router.post('/paymentFailed',isLoggedIn, orderCtrl.paymentFailed);
Router.get('/orderSuccess',isLoggedIn, orderCtrl.orderSuccess);
Router.get('/orderFailed',isLoggedIn, orderCtrl.orderFailed);
Router.post('/returnOrder',isLoggedIn, orderCtrl.returnOrder);
Router.post('/generateInvoice',isLoggedIn, orderCtrl.generateInvoice);
Router.post('/repaymentOrder',isLoggedIn, orderCtrl.repaymentOrder);


//<------------ wallet routes -------------->
Router.get('/wallet',walletCtrl.getWalletPage);

Router.get('/faq',(req, res ) => {
   res.render('faq')
})
Router.get('/aboutUs',(req, res ) => {
   res.render('aboutUs')
})


module.exports = Router;
