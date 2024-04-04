const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const multer = require('multer');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//image rendering
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

//product list
const getProduct = async(req, res) => {
    try {
       const products = await Product.find();
       res.render('product-list',{products})
    } catch (error) {
       console.log(error);
       res.status(500).send('Server internal Error');
    }   
   };
   


const loadProduct = async(req, res) => {
    const categories = await Category.find({deleted: false})
    try {
        res.render('product-add',{categories})
    } catch (error) {
        res.send(error.message);
    }
};

//adding products
const insertProduct = async (req, res) => {
    try {
        const productName = req.body.productName;
        const existingProduct = await Product.find({ productName : productName });



        if( !existingProduct ){
            const product = new Product({
                productName: req.body.productName,
                productImage: req.file.filename,
                category: req.body.category,
                description: req.body.description,
                brand: req.body.brand,
                color: req.body.color,
                price: req.body.price,
                size: req.body.size,
                stock: req.body.stock
            });
            const result = await product.save();
           res.redirect('/admin/product-list');

        }else{
            console.log('already exists');
            console.log('PRINT THIS TOO');
            res.redirect('/admin/product-list');
        };

   
       //add flash messages
    } catch (error) {
       console.error(error);
        res.status(500).send(error.message);
    }
};


//delete product
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        console.log(product);
        if (!product) {
            res.redirect('/admin/product-list')
            req.flash('msg','Product Not found');
        }else{
        product.deleted = true;
        await product.save();
        }
        return res.redirect('/admin/product-list');
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal server error');
    }
};

//load product edit
const loadProductEdit = async (req, res) => {
    try {
    const id = req.params.id;
    const categories = await Category.find({deleted: false});
    const products = await Product.findById(id)
    if (!products) {
       return res.status(404).send("Product not found");
    }
        res.render('product-edit',{products: [products,
       categories]
    })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};

//search product
const searchProduct = async(req, res) => {
    try {
       const input = req.query.input;
       const products = await Product.find({category: input});
       console.log(products);
       res.render('search');

       
    } catch (error) {
       console.log(error);
       res.status(500).send('Server internal Error');
    }   
 };



 
// product edit
const editProduct = async (req, res) => {
    try {
        console.log('body: ', req.body);
        const { productName, productImage, category, description, brand, color, price, size, stock } = req.body;
        const updatedFields = {
       productName : productName,
       category: category,
       description: description,
       brand : brand,
       stock : stock,
       color : color,
       productImage : productImage};

        const productId = req.params.id; 
        const product = await Product.findByIdAndUpdate(productId, updatedFields, { new: true });

        if (!product) {
             return res.send('error');
        }

        return res.redirect('/admin/product-list');
    } catch (error) {
        console.log('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
};


 

module.exports = {
    getProduct,
    loadProduct,
    insertProduct,
    deleteProduct,
    searchProduct,
    loadProductEdit,
    editProduct
};