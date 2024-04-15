const Product = require('../models/productModel');
const User = require('../models/userModel');
const wishlist = require('../models/wishlistModel');

const getwishlist = async (req, res) => {
    try{
        // const wishlists = await wishlist.find();
        // const wishlist = await wishlist.find();
        // const proId = await wishlist.distinct("productId")
        // console.log('PRO ID: ',proId);
        // const products = await Product.find({ _id: { $in: proId } }); 
        // res.render('wishlist',{
        //    products
        // });
        res.render('error')

    }catch(error){
        console.log(error.message);
    }
};

//adding prodcuts to wishlist
const addToWishlist = async (req, res) => {

    try {
        
console.log('THE USERID: ',req.body.userId);
        
console.log('THE PRODUCT: ',req.body.productId);

        const wishlist = new wishlist({
            userId: req.body.userId,
            productId: req.body.productId
        });
        const result = await wishlist.save()
     res.redirect('/wishlist');
        
    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    getwishlist,
    addToWishlist
};