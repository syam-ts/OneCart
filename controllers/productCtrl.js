const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const multer = require('multer');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//<------------ imgage rendering -------------->
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


  /**
         * ! User Prouduct Controller 
                                       * */

//<------------ shopping page -------------->
const getShopping = async (req, res) => {
    try {
        const products = await Product.find({deleted : false });
        res.render('shopping',{ products });
    } catch (error) {
        console.log(error.message);
    }
};


//<------------ product details -------------->
  const productDetails = async(req, res) => {
    try {
    const productId = req.params.id;
       const products = await Product.findById(productId);
       const user = req.session.user;
       const category = products.category;

       const relatedProducts = await Product.find({category: {$in : category}})
       res.render('product',{ datas:[ products, user ,relatedProducts]});
          } catch (error) {
            console.log(error);
            res.status(500).send('Server internal Error');
          }   
      };



//<------------ search products -------------->
const searchProduct = async(req, res) => {
    try {
       const limit = 4;
       const input = req.query.searchTerm;
       const product = await Product.find({ productName: input }).limit(limit);
       const total = await Product.find().count();

      
       const totalProduct = total / 4;
       res.render('search', { product  , totalProduct});

    } catch (error) {
       console.log(error);
       
        res.render('error', {message : "Product Not Found"})
   
    }   
 };


//<------------ advanced search  -------------->
const getLowToHigh = async (req, res) => {
    try {
       const limit = 4;
        const input = req.params.id;
        const category = await Product.findOne({category : input});
            const total = await Product.find({category : input}).count();
          const totalProduct = total / 4;
            const products = await Product.find({ category: input }).sort({price : 1}).limit(limit);
        res.render('search', { products, category :category.category, totalProduct }); 
     
    } catch (error) {
        console.log(error.message);
    }
};

const getHighToLow = async (req, res) => {
    try {
        const limit = 4;
          const input = req.params.id;

        const category = await Product.findOne({category : input});
            const total = await Product.find({category : input}).count();
    const totalProduct = total / 4;
            
        const products = await Product.find({ category: input }).sort({price : -1}).limit(limit);
    res.render('search', { products, category :category.category, totalProduct }); 
     
    } catch (error) {
        console.log(error.message);
    }
};

const getnewArrivals = async (req, res) => {
    try {
        const limit = 4;
          const input = req.params.id;
        const category = await Product.findOne({category : input});
            const total = await Product.find({category : input}).count();
          const totalProduct = total / 4;
            const products = await Product.find({extras: "newArrivals"}).limit(limit);
    res.render('search', { products, category :category.category, totalProduct }); 
  
     
    } catch (error) {
        console.log(error.message);
    }
};

const getAtoZ = async (req, res) => {
    try {
        const limit = 4;
          const input = req.params.id;
        const category = await Product.findOne({category : input});
            const total = await Product.find({category : input}).count();
          const totalProduct = total / 4;
            const products = await Product.find({ category: input }).sort({productName : 1}).limit(limit);
    res.render('search', { products, category :category.category, totalProduct }); 
     
    } catch (error) {
        console.log(error.message);
    }
};

const getZtoA = async (req, res) => {
    try {
        const limit = 4;
          const input = req.params.id;
        const category = await Product.findOne({category : input});
        const total = await Product.find({category : input}).count();
      const totalProduct = total / 4;
        const products = await Product.find({ category: input }).sort({productName : -1}).limit(limit);
    res.render('search', { products, category :category.category, totalProduct }); 
     
    } catch (error) {
        console.log(error.message);
    }
};

//<------------ pagination -------------->
const getPagination = async (req, res) =>  {
    try {
       const limit = 4;
       const page = req.params.id;
       const cat = req.params.cat;
       const products = await Product.find({category : cat})
       .skip((page - 1) * limit).limit(limit) 
       const total = await Product.find().count();
       const category = await Product.findOne({category : cat});

       const number = total / 4
       const totalProduct = Math.floor(number);
       res.render('search', { products , category:category.category , totalProduct});
       
   } catch (error) {
       console.log(error.message);
   }       
};
 

const getAdminPagination = async (req, res) =>  {
    try {
       
         const page = req.params.id;
        
        const limit = 4;
        const products = await Product.find()
        .skip((page - 1) * limit).limit(limit) 
         
        
        const total = await Product.find().count();
        const category = await Product.findOne();

        const number = total / 4
        const totalProduct = Math.floor(number);

        console.log('THE TOAL PRODUC : ',totalProduct)
       
        res.render('product-list', { products ,  totalProduct});
        
    } catch (error) {
        console.log(error.message);
    }
}




 /**
         * ! Admin Prouduct Controller 
                                       * */
//<------------ product listing -------------->
const productList = async(req, res) => {
    try {
        const limit = 4;
       const products = await Product.find().limit(limit);
       const total = await Product.find().count();
       const totalProduct = total / 4;

       res.render('product-list',{products ,totalProduct})
    } catch (error) {
       console.log(error);
       res.status(500).send('Server internal Error');
    }   
   };

   //<------------ proudct add page load -------------->
   const ProductAdd = async(req, res) => {
    const categories = await Category.find({deleted: false})
    try {
        res.render('product-add',{categories})
    } catch (error) {
        res.send(error.message);
    }
};

//<------------ add prouduct -------------->
const insertProduct = async (req, res) => {
    try {
        const { price, size, stock, } = req.body;
          
            const productName = req.body.productName;
          if(price < 0){
            console.log('The price should be positive');
            res.redirect('/admin/product-add');
             
            }else if(size < 0){
                console.log(`SIZE IS CAN'T BE NEGATIVE`);
                res.redirect('/admin/product-add');
            }else if(stock < 0){
                console.log(`STOCK IS CAN'T BE NEGATIVE`);
                res.redirect('/admin/product-add');
            }else{
                const existingProduct = await Product.find({ productName: productName });
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
                   }else {
                console.log('Product already exists');
                res.redirect('/admin/product-list');
            }
          }}
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

//<------------ load product edit -------------->
const getProductEdit = async (req, res) => {
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

//<------------ update product edit -------------->
const postProductEdit = async (req, res) => {
    try {
        const { productName, category, description, brand, color, price, size, stock, extras } = req.body;
        const productId = req.params.id; 

        // Retrieve existing product details
        let product = await Product.findById(productId);
        if (!product) {
            return res.send('Product not found');
        }

        // Update fields other than product images
        product.productName = productName;
        product.category = category;
        product.description = description;
        product.brand = brand;
        product.stock = stock;
        product.color = color;
        product.price = price;
        product.size = size;
        product.extras = extras;

        // file uploads separately
        if (req.files && req.files.length > 0) {
            const productImages = req.files.map(file => file.filename);
            product.productImage = productImages;
        }

        // Save the updated product
        product = await product.save();

        return res.redirect('/admin/product-list');
    } catch (error) {
        console.log('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

//<------------ product soft delete -------------->
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
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



module.exports = {
    getShopping,
    productDetails,
    productList,
    ProductAdd,
    insertProduct,
    getProductEdit,
    postProductEdit,
    deleteProduct,

    searchProduct,
    getLowToHigh,
    getHighToLow,
    getnewArrivals,
    getAtoZ,
    getZtoA,
    getPagination,
    getAdminPagination
};