const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const multer = require('multer');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const maxCount = 5;
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.use(upload.array('productImage',maxCount));

//product list
const getProduct = async(req, res) => {
    try {
       const products = await Product.find({deleted:false});
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


// product edit
const editProduct = async (req, res) => {
    try {
        console.log('body: ',req.body);
        const { prouductName, brand, stock, color, productImage } = req.body;

        const updatedFields = {};
        if (prouductName) updatedFields.prouductName = prouductName;
        if (brand) updatedFields.brand = brand;
        if (stock) updatedFields.stock = stock;
        if (color) updatedFields.color = color;
        if (productImage) updatedFields.productImage = productImage;

        const productId = req.params.id; 
        const product = await Product.findByIdAndUpdate(productId, updatedFields, { new: true });

        if (!product) {
             res.send('error');
        }

        res.redirect('/admin/product-list');
    } catch (error) {
        console.log('Error:', error);
    }
};

 

module.exports = {
    getProduct,
    loadProduct,
    insertProduct,
    deleteProduct,
    loadProductEdit,
    editProduct
};