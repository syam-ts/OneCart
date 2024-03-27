const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const productDisplay = require('../controllers/productDisplay');
const productListing = require('../controllers/productListingController');
const userController = require('../controllers/userController');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));




//login
router.get('/login' ,userController.getLogin);
router.post('/login',userController.verifyLogin);

//signup 
router.get('/signup',(req, res) => {res.render('signup')});
router.post('/signup',userController.insertUser);

//home
router.get('/home',productListing.listProduct);

//product
router.get('/product',productDisplay.displayProduct);

//wishlist
router.get('/wishlist',(req, res) => {res.render('wishlist')});

//cart
router.get('/cart',(req, res) => {res.render('cart')});

//userProfile
router.get('/userProfile',(req, res) => {
    res.render('userProfile');
}); 

//search
router.get('/search',(req, res)=> { res.render('search');});

//logout
router.get('logout' ,(userController.getLogout));





module.exports = router;