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
                                       **/

//<------------ shopping page -------------->

const getShopping= async (req, res) => {
    try {
            const sortMethod = req.body.sortOption;
            let sortQuery = {};
            switch (sortMethod) {
                case "lowToHigh":
                    sortQuery = { price: 1 };
                    break;
                case "highToLow":
                    sortQuery = { price: -1 };
                    break;
                case "nameAce":
                    sortQuery = { productName: 1 };
                    break;
                case "nameDec":
                    sortQuery = { productName: -1 };
                    break;
                default:
                    sortQuery = {};
             }
        
            var page = 1;
            const limit = 8;
            if (req.query.page) {
                page = parseInt(req.query.page);
              }
            const products = await Product.find({deleted : false })
             .limit(limit * 1)
             .skip((page - 1) * limit)
             .exec();
            
             const count = await Product.find({deleted : false })
             .countDocuments();
             const categories = await Category.find({deleted : false })
        
            res.render('shopping',{
                 products : products,
                 categories: categories,
                 totalPage : Math.ceil(count / limit),
                 currentPage : page,
                 previousPage: page - 1,
                 nextPage: parseInt(page) + 1
            });
            } catch (error) {
                console.log(error.message);
                res.status(500).send("Internal Server Error");
            }
            
        }


        //<------------ pagination & advanced sort shopping page -------------->
 const sortShoppingPage = async (req, res) => {
            try {
                const sortMethod = req.params.method;
                var sortQuery = {}; 
           
                switch (sortMethod) {
                   case "lowToHigh":
                       sortQuery = { price: 1 };
                       break;
                   case "highToLow":
                       sortQuery = { price: -1 };
                       break;
                   case "aToZ":
                       sortQuery = { productName: 1 };
                       break;
                   case "zToA":
                       sortQuery = { productName: -1 };
                       break;
                   default:
                       sortQuery = {};
                      }

                    var page = 1;
                    const limit = 8;
                    if (req.query.page) {
                        page = parseInt(req.query.page);
                     }
                  
                    const products = await Product.find({ deleted: false })
                        .limit(limit * 1)
                        .skip((page - 1) * limit)
                        .sort(sortQuery) 
                        .exec();
                  
                    const count = await Product.find({ deleted: false }).countDocuments();
                    const categories = await Category.find({deleted : false })
                  
                    res.render('shopping', {
                        products: products,
                        categories : categories,
                        totalPage: Math.ceil(count / limit),
                        currentPage: page,
                        previousPage: page > 1 ? page - 1 : 1,
                        nextPage: page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit)
                    });
                
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



 /**
         * ! Admin Prouduct Controller 
                                       * */
//<------------ product listing -------------->
const productList = async(req, res) => {
    try {
        var page = 1;
            const limit = 8;
            if (req.query.page) {
                page = parseInt(req.query.page);
            }
          
            const products = await Product.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
          
            const count = await Product.find().countDocuments();
            res.render('product-list', {
                products: products,
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page > 1 ? page - 1 : 1,
                nextPage: page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit),
                toastMessage: { type: 'success', text: '' }
            });
        
    } catch (error) {
       console.log(error);
       res.status(500).send('Server internal Error');
    }   
   };
  //<------------ proudct sort with pagination -------------->
   const sortProductAdmin = async (req, res) => {
    try {
        const sortMethod = req.params.method;
        var sortQuery = {}; 
   
        switch (sortMethod) {
           case "recentProducts":
               sortQuery = { createdate: -1 };
               break;
           case "olderProducts":
               sortQuery = { createdate: 1 };
               break;
           default:
               sortQuery = {};
              }

       if(sortMethod == "blockedProducts"){
        var page = 1;
            const limit = 8;
            if (req.query.page) {
                page = parseInt(req.query.page);
            }
          
            const products = await Product.find({deleted : true})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
          
            const count = await Product.find({deleted : true}).countDocuments();
            res.render('product-list', {
                products: products,
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page > 1 ? page - 1 : 1,
                nextPage: page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit)
            });
        
       }else if(sortMethod == "unBlockedProducts"){
        var page = 1;
        const limit = 8;
        if (req.query.page) {
            page = parseInt(req.query.page);
          }
      
        const products = await Product.find({deleted : false})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Product.find({deleted : false}).countDocuments();
      
        res.render('product-list', {
            products: products,
            totalPage: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page > 1 ? page - 1 : 1,
            nextPage: page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit)
                });
            }
            var page = 1;
            const limit = 8;
            if (req.query.page) {
                page = parseInt(req.query.page);
            }
            const products = await Product.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort(sortQuery) 
                .exec();
          
            const count = await Product.find().countDocuments();
            res.render('product-list', {
                products: products,
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page > 1 ? page - 1 : 1,
                nextPage: page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit)
            });
        
    } catch (error) {
        console.log(error.message);
    }
   }


   //<------------ proudct add page load -------------->
   const ProductAdd = async(req, res) => {
    const categories = await Category.find({deleted: false})
    try {
        res.render('product-add',{categories})
    } catch (error) {
        res.send(error.message);
    }
};


//<------------ adding new product -------------->
const insertProduct = async (req, res) => {
    try {
        const {price, description, size, stock, } = req.body;
        const productImages = req.files.map(file => file.filename);
        const allowedExtensions = ['jpg', 'jpeg', 'png','webp'];
        const extensions = productImages.map(img => img.split('.').pop().toLowerCase());
        const allExtensionsAllowed = extensions.every(ext => allowedExtensions.includes(ext));
           if (!allExtensionsAllowed) {
                        res.redirect('/admin/product-add?message=The image format not support&type=error')
                    }else if(description.length < 20){
                        res.redirect('/admin/product-add?message=Description should have atleast 20 words&type=error');
                    }else if(price < 300 || price > 40000){
                        res.redirect('/admin/product-add?message=The price should be between 300 and 40000&type=error');
                    }else if(size < 4 || size > 42){
                        res.redirect('/admin/product-add?message=The size should be between 4 and 42&type=error');
                    }else if(stock < 1 || stock > 1000){
                        res.redirect('/admin/product-add?message=The stock should be between 1 and 1000&type=error');
                    }else{
                       const {productName, category, brand, color, size, stock } = req.body;
                         const product = new Product({
                             productName: productName,
                             productImage: productImages,
                             category: category,
                             description: description,
                             brand: brand,
                             color: color,
                             price: price,
                             size: size,
                             stock: stock
                         });
                         await product.save();
                         res.redirect('/admin/sortProductAdmin/recentProducts?message=New product created&type=success')}
                    }catch (err) {
        res.render('error', {message : err});
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

        const productImages = req.files.map(file => file.filename);
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        const extensions = productImages.map(img => img.split('.').pop().toLowerCase());
        const allExtensionsAllowed = extensions.every(ext => allowedExtensions.includes(ext));
           if (!allExtensionsAllowed) {
                        res.redirect('/admin/product-add?message=The image format not support&type=error')
                    }else if(description.length < 20){
                        res.redirect('/admin/product-add?message=Description should have atleast 20 words&type=error');
                    }else if(price < 300 || price > 40000){
                        res.redirect('/admin/product-add?message=The price should be between 300 and 40000&type=error');
                    }else if(size < 4 || size > 42){
                        res.redirect('/admin/product-add?message=The size should be between 4 and 42&type=error');
                    }else if(stock < 1 || stock > 1000){
                        res.redirect('/admin/product-add?message=The stock should be between 1 and 1000&type=error');
                    }else{
                        const productId = req.params.id; 

                        // Retrieve existing product details
                        let product = await Product.findById(productId);
                        if (!product) {
                            return res.render('product-list?message=New Address added&type=success');
                        }
                
                        // Update fields other than product images
                        product.productName = productName;
                        product.productImage = productImages;
                        product.category = category;
                        product.description = description;
                        product.brand = brand;
                        product.stock = stock;
                        product.color = color;
                        product.price = price;
                        product.size = size;
                        product.extras = extras;
                
                        // Save the updated product
                        product = await product.save();
                        return res.redirect('/admin/sortProductAdmin/recentProducts?message=Product Updated&type=success');
                    }

    } catch (error) {
        console.log('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

//<------------ product soft delete -------------->
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const url = req.url;
        console.log('The url : ',url)
        const product = await Product.findById(id);
     if(product.deleted == false){
        product.deleted = true;
        await product.save();
        return res.redirect(`/admin/product-list${req.url.includes('?') ? '&' : '?'}message=Product%20Unlisted&type=success`);

     }
     else if(product.deleted == true) {
        product.deleted = false;
        await product.save();
        return res.redirect(`/admin/product-list${req.url.includes('?') ? '&' : '?'}message=Product Listed&type=success`);
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
    sortShoppingPage,
    productDetails,

    productList,
    sortProductAdmin,
    ProductAdd,
    insertProduct,
    getProductEdit,
    postProductEdit,
    deleteProduct,

    searchProduct,
    getLowToHigh

};