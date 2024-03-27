const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const express = require('express');
const router = express.Router();

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const loadProduct = async(req, res) => {
    const categories = await Category.find({deleted: false})
    try {
        res.render('product-add',{categories})
    } catch (error) {
        console.log(error.message);
    }
};



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
       res.send('Product added successfully: ');
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
            return res.status(404).send('Product not found');
        }else{
        product.deleted = true;
        await product.save();
        }
        return res.send(product);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal server error');
    }
};

//load product edit
const loadProducEdit = async(req, res) => {
    const id = req.params.id;
    const categories = await Category.find({deleted: false});
    const products = await Product.findById(id)
    console.log('id: ',products);
    try {
        res.render('product-edit',{products: [products,
       categories]
    })
    } catch (error) {
        console.log(error.message);
    }
};

const storage = multer.memoryStorage();

// create Multer upload
const upload = multer({ storage });


const productUpdate = async (req, res) => {
        try {
            const productId = req.params.id;
            const updatedProduct = req.body;
            const product = await Product.findOneAndUpdate(
              { _id: new ObjectId(productId) },
              { $set: updatedProduct },
              { new: true }
            );
            res.send('Sucess');
          } catch (error) {
            console.log(error.message);
          }
        };

 

module.exports = {
    loadProduct,
    insertProduct,
    deleteProduct,
    loadProducEdit,
    productUpdate
};