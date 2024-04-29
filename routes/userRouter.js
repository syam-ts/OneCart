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
const couponController = require('../controllers/couponCtrl');
const walletController = require('../controllers/walletCtrl');
var cors = require('cors');
const dotenv = require('dotenv');
const Product = require('../models/productModel');
const couponModel = require('../models/couponModel');
const multer = require('multer');
const {isLoggedIn} = require('../config/auth');

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
Router.get('/userProfileSidebar',async (req , res) => {
   try {
      const userId = req.session.user;
      const user = await User.find(userId);
      res.render('userProfileSidebar',{user})
   } catch (error) {
      console.log(error.message);
   }
})

   //<------------ product routes -------------->
Router.get('/product/:id',productController.productDetails);
Router.get('/shopping?', productController.getShopping);
Router.post('/sortShopping',async(req, res) => {
 
   console.log('The real one : ',req.body)
   const sortMethod = req.body.sort;

   var sortQuery = {}; 
   
   switch (sortMethod) {
      case "lowToHigh":
          sortQuery = { price: 1 };
          break;
      case "highToLow":
          sortQuery = { price: -1 };
          break;
      case "nameAse":
          sortQuery = { productName: 1 };
          break;
      case "nameDec":
          sortQuery = { productName: -1 };
          
          console.log('This is the High to low',)
          break;
      default:
          sortQuery = {};
  }

  var page = 1;
  const limit = 4;
  if (req.query.page) {
      page = parseInt(req.query.page);
  }

  const products = await Product.find({ deleted: false })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortQuery) 
      .exec();

  const count = await Product.find({ deleted: false }).countDocuments();

  res.render('shopping', {
      products: products,
      totalPage: Math.ceil(count / limit),
      currentPage: page,
      previousPage: page > 1 ? page - 1 : 1,
      nextPage: page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit)
  });
});

Router.get('/sortShopping/:method', async (req, res) => {
    try {
        const method = req.params.method;
        if(method == "HighToLow"){
            var page = 1;
            const limit = 8;
            if (req.query.page) {
                page = parseInt(req.query.page);
            }
          
            const products = await Product.find({ deleted: false })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({price : 1}) 
                .exec();
          
            const count = await Product.find({ deleted: false }).countDocuments();
          
            res.render('shopping', {
                products: products,
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page > 1 ? page - 1 : 1,
                nextPage: page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit)
            });
        }
    } catch (error) {
        console.log(error.message);
    }
});



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
Router.post('/wishlist',wishlistController.addToWishlist);

   //<------------ cart routes -------------->
Router.get('/cart',isLoggedIn, cartController.getCart);
Router.post('/addToCart',isLoggedIn, cartController.addToCart);
Router.get('/removeCart/:id',isLoggedIn, cartController.removeCart);
Router.get('/checkout/:id',isLoggedIn, cartController.getCheckout);
Router.post('/cartDec',isLoggedIn, cartController.cartDec);
 
   //<------------ order routes -------------->
Router.get('/orderHistory',isLoggedIn, orderController.getOrderHistory);
Router.post('/placeOrder',isLoggedIn, orderController.insertOrder);
Router.post('/verifyOrder',isLoggedIn, orderController.verifyAndInsertOrder);
Router.post('/orderCancel',isLoggedIn, orderController.orderCancel);
Router.get('/orderDetailsUser/:id',isLoggedIn, orderController.orderDetailsUser);

//<------------ creating order -------------->
     Router.post('/create-order', async (req, res) => {
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


//<------------ order success -------------->
Router.get('/orderSuccess',(req, res) => {
    res.render('orderSuccess');
});

//<------------ wallet routes -------------->
Router.get('/wallet',walletController.getWalletPage);

//<------------ pagination route -------------->

Router.get("/shopping", async (req, res) => {
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

module.exports =Router;
