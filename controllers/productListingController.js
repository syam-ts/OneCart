const Product = require('../models/productModel');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const listProduct = async(req, res) => {
 try {
    const products = await Product.find();
    res.render('home',{products})
 } catch (error) {
    console.log(error);
    res.status(500).send('Server internal Error');
 }   
};

const displayProduct = async(req, res) => {
   try {
   const productId = req.params.id;
   
   console.log('req: ',productId);
      const products = await Product.findById(productId);
      res.render('product',{products});
   } catch (error) {
      console.log(error);
      res.status(500).send('Server internal Error');
   }   
  };

const searchProduct = async(req, res) => {
   try {
      const products = await Product.find();
      res.render('search',{products})
   } catch (error) {
      console.log(error);
      res.status(500).send('Server internal Error');
   }   
  };

module.exports = {
    listProduct,
    displayProduct,
    searchProduct
};