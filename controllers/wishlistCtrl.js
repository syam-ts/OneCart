const Product = require('../models/productModel');
const User = require('../models/userModel');
const Wishlist = require('../models/wishlistModel');

//<------------ wishlist page -------------->
const getwishlist = async (req, res) => {
    try {
        const userId = req.session.user;
        const user = await User.findById(userId);
        const wishlist = await Wishlist.find({ userId: userId });
        const productIds = wishlist.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        res.render('wishlist', {
            products : products,
            user : user
        });
    } catch (error) {
        console.log(error.message);
        res.render('error'); 
    }
};


//<------------ adding products to wishlist -------------->
const addToWishlist = async (req, res) => {
    try {
        console.log('The wihslist body : ',req.body)
        const productId = req.body.productId;
        const userId = req.session.user;
        const existingItem = await Wishlist.findOne({
            productId: productId,
            userId: userId
        });
        if (!existingItem) {
            if(req.body.quantity > 3){
                console.error('Cannot add more than 3 quantity');
                res.status(400).json({ error: 'Cannot add more than 3 quantity' });
            } else {
                const wishlist = new Wishlist({
                    userId,
                    productId: req.body.productId
                });
                await wishlist.save();
                res.status(200).json({ message: 'Product added to wishlist successfully' });
            }
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    } };


    const removeWishlist = async (req, res) => {
        try {
            const userId = req.session.user;
            const productId = req.body.productId;
            
            const wishlist = await Wishlist.findOneAndDelete({ userId: userId, productId: productId });
            res.redirect('/wishlist')
        } catch (err) {
            res.render('error',{ message : err.message}); 
        }
    };

module.exports = {
    getwishlist,
    addToWishlist,
    removeWishlist
};