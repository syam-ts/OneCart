const Product = require('../models/productMdl');
const User = require('../models/userMdl');
const Wishlist = require('../models/wishlistMdl');
const Cart = require('../models/cartMdl');

//<------------ wishlist page -------------->
const getwishlist = async (req, res) => {
    try {
        const userId = req.session.user , user = await User.findById(userId);
        const wishlist = await Wishlist.find({ userId: userId });
        const productIds = wishlist.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });
        res.render('wishlist', { products : products, user : user});
    }catch (err) {
        res.render('error',{ message : err.message}); 
    }
};


//<------------ adding product to wishlist -------------->
const addToWishlist = async (req, res) => {
    try {
        const { productId ,userId } = req.body;
        const existingItem = await Wishlist.findOne({ productId: productId, userId: userId});
        if (!existingItem) {
            if(req.body.quantity > 3){
                res.status(400).json({ error: 'Cannot add more than 3 quantity' });
            } else {
                const wishlist = new Wishlist({ userId, productId: req.body.productId});
                await wishlist.save();
                console.log('This worked')
                res.status(200).json({ message: 'Product added to wishlist successfully' });
            }
        }
    } catch (err) {
        res.render('error',{ message : err.message}); 
    } };


//<--------------------- removing product --------------------->
    const removeWishlist = async (req, res) => {
        try {
            const userId = req.session.user;
            const productId = req.body.productId;
            await Wishlist.findOneAndDelete({ userId: userId, productId: productId });
            res.redirect('/userAddress')
        } catch (err) {
            res.render('error',{ message : err.message}); 
        }
    };


//<--------------------- adding to cart --------------------->
    const addTocartByWishlist = async (req, res) => {
        try {
            console.log('It reached this far')
            const productId = req.body.productId;
            const userId = req.session.user;
            const existingItem = await Cart.findOne({ productId: productId, userId: userId });
            if (!existingItem) {
                if(req.body.quantity > 5){
                    res.status(400).json({ error: 'Cannot add more than 5 quantity' });
                } else {
                    const cart = new Cart({ userId, productId: req.body.productId, quantity: req.body.quantity });
                    await cart.save();
                    const product = await Product.findById(productId); 
                    await Wishlist.findOneAndDelete({ userId: userId, productId: productId });
                    product.stock -= req.body.quantity;
                    await product.save();
                    res.status(200).json({ message: 'Product added to cart successfully' })};
                } else {
                if(req.body.quantity > 5){
                    res.status(400).json({ error: 'Cannot add more than 5 quantity' });
                } else {
                    if(existingItem.quantity + req.body.quantity > 5){
                        res.status(400).json({ error: 'Cannot add more than 5 quantity from the existing item' });
                    } else {
                        existingItem.quantity += req.body.quantity;
                        await existingItem.save();
                        const product = await Product.findById(productId); 
                        product.stock -= req.body.quantity;
                        await product.save();
                        res.status(200).json({ message: 'Product added to cart successfully' });
                      }
                  }
              }
            } catch (error) {
                console.log(error.message);
                res.status(500).json({ error: 'Internal server error' })}
        };
module.exports = {
    getwishlist,
    addToWishlist,
    removeWishlist,
    addTocartByWishlist
};