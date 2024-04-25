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
const walletController = require('../controllers/walletCtrl');
var cors = require('cors');
const dotenv = require('dotenv');
const Product = require('../models/productModel');
const couponModel = require('../models/couponModel');
const multer = require('multer');

const User = require('../models/userModel');

//<------------ imgage rendering -------------->
const storage = multer.diskStorage({
   destination:(req, file, cb) => {
       cb(null,'./public/product_images')
   },
   filename:(req, file, cb) => {
       const name = Date.now()+''+file.originalname;
       cb(null, name);
   }
});
const upload = multer({ storage });


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
router.get('/userEdit',userController.getUserEdit);
router.post('/userEdit',upload.single('userImage'),userController.insertUserDetails);
router.get('/userProfileSidebar',async (req , res) => {
   try {
      const userId = req.session.user;
      const user = await User.find(userId);
      res.render('userProfileSidebar',{user})
   } catch (error) {
      console.log(error.message);
   }
})


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


   //<------------ userProfile || address-------------->
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
router.post('/orderCancel',orderController.orderCancel);

//<------------ creating order -------------->
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
     
//<------------ coupon search -------------->
 router.post('/couponSearch',couponController.couponSearch);


//<------------ order success -------------->
router.get('/orderSuccess',(req, res) => {
    res.render('orderSuccess');
});

//<------------ wallet routes -------------->
router.get('/wallet',walletController.getWalletPage);

//<------------ pagination route -------------->

router.get("/shopping", async (req, res) => {
	try {
		const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 5;
		const search = req.query.search || "";
		let sort = req.query.sort || "Trending";

		req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
		let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = "asc";
		}

		const product = await Product.find({ name: { $regex: search, $options: "i" } })
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

		const total = await Product.countDocuments({
			sort: { $in: [...sort] },
			name: { $regex: search, $options: "i" },
		});

		const response = {
			error: false,
			total,
			page: page + 1,
			limit,
			product,
		};

		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

module.exports = router;
