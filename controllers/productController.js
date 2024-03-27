const Product = require('../models/productModel');


const loadProduct = async(req, res) => {
    try {
        res.render('product-add')
    } catch (error) {
        console.log(error.message);
    }
}

const insertProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const product = new Product({
            productName: req.body.productName,
            productImage: req.file.filename,
            productCategory: req.body.productCategory,
            description: req.body.description,
            brand: req.body.brand,
            color: req.body.color,
            price: req.body.price,
            size: req.body.size,
            stock: req.body.stock
        });
        const result = await product.save();

       res.send('Product added successfully: ');
        
    } catch (error) {
       console.error(error);
        res.status(500).send(error.message);
    }
};



module.exports = {
    loadProduct,
    insertProduct
};