const express = require('express');
const router = express.Router();

router.get('/home' ,(req, res) => {
    res.render('home')
});

router.get('/wishlist',(req, res) => {
    res.render('wishlist');
});

router.get('/cart',(req, res) => {
    res.render('cart');
});





module.exports = router;