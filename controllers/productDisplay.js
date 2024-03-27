const Product = require('../models/productModel');

const displayProduct = async(req, res) => {
 try {
    const products = await Product.find();
    res.render('product',{products})
    console.log(products);
 } catch (error) {
    console.log(error);
    res.status(500).send('Server internal Error');
 }   
};

module.exports = {
    displayProduct
};