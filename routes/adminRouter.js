const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

//admin-login
router.get('/admin-login',(req, res) => {res.render('admin-login')});

//dashboard
router.get('/dashboard',(req, res) => {res.render('dashboard')});

//userManagement
router.get('/userManagement',(req, res) => {res.render('userManagemen')});


//product add
router.get('/product-add',(req, res) => {res.render('product-add')});






module.exports = router;