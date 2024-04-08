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
const upload = multer({ storage }).array('productImage');

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
        const existingProduct = await Product.find({ productName: productName });
        console.log('THE EXIT: ',existingProduct.length)

        if (existingProduct.length == 0) {
        
                const productImages = req.files.map(file => file.filename);
     
                
                const product = new Product({
                    productName: req.body.productName,
                    productImage: productImages,
                    category: req.body.category,
                    description: req.body.description,
                    brand: req.body.brand,
                    color: req.body.color,
                    price: req.body.price,
                    size: req.body.size,
                    stock: req.body.stock
                });

                await product.save();
                res.redirect('/admin/product-list');
          
        } else {
            console.log('Product already exists');
            res.redirect('/admin/product-list');
        }

        // Add flash messages if needed
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
        console.log('THE PROD: ',id);
     if(product.deleted == false){

        product.deleted = true;
        await product.save();
        return res.redirect('/admin/product-list');
     }
     else if(product.deleted == true) {
        product.deleted = false;
        await product.save();
        return res.redirect('/admin/product-list');
     }else{
        return res.status(404).send('prouduct not found');
     }


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
       const input = req.query.searchTerm;
       const products = await Product.find({ category: input });
       res.render('search', { products }); 
    } catch (error) {
       console.log(error);
       res.status(500).send('Server internal Error');
    }   
 };




 
// product edit
const editProduct = async (req, res) => {
    try {
      
        const productImages = req.files.map(file => file.filename);

        const { productName, category, description, brand, color, price, size, stock } = req.body;
        const updatedFields = {
       productName : productName,
       category: category,
       description: description,
       brand : brand,
       stock : stock,
       color : color,
       price : price,
       size : size,
       productImage : productImages};

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