const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const user = require('../controllers/userController');

//login
router.get('/login' ,(req, res) => {res.render('login')});

//signup 
router.get('/signup',(req, res) => {res.render('signup')});
router.post('/signup',user.insertUser);

//home
router.get('/home',(req, res) => {res.render('home')});

//wishlist
router.get('/wishlist',(req, res) => {res.render('wishlist')});

//cart
router.get('/cart',(req, res) => {res.render('cart')});




module.exports = router;