const Product = require('../models/productModel');

const getProduct = async(req, res) => {
 try {
    const products = await Product.find({deleted:false});
    res.render('product-list',{products})
 } catch (error) {
    console.log(error);
    res.status(500).send('Server internal Error');
 }   
};

module.exports = {
    getProduct
};