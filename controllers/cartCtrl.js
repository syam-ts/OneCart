const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Address = require('../models/addressModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');

  //<------------ load cart --------------> 
const getCart = async (req, res) => {
    try{
        const userId = req.session.user;
        const cart = await Cart.find({userId : userId});
        const productIds = cart.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } }); 
        if(products.length != 0){
            res.render('cart', { items: { products, cart} }); 
        }else{
            res.render('cart', { items: { products, cart} }); 
        };
            }catch(error){
                console.log(error.message);
            }
        };

   //<------------ adding prodcuts to cart --------------> 
   const addToCart = async (req, res) => {
    try {
        const productId = req.body.productId;
        const userId = req.session.user;
        const existingItem = await Cart.findOne({
            productId: productId,
            userId: userId
        });
        if (!existingItem) {
            if(req.body.quantity > 5){
                console.error('Cannot add more than 5 quantity');
                res.status(400).json({ error: 'Cannot add more than 5 quantity' });
            } else {
                const cart = new Cart({
                    userId,
                    productId: req.body.productId,
                    quantity: req.body.quantity
                });
                await cart.save();
                const product = await Product.findById(productId); 
                product.stock -= req.body.quantity;
                await product.save();
                res.status(200).json({ message: 'Product added to cart successfully' });
            }
        } else {
            if(req.body.quantity > 5){
                console.log('Cannot add more than 5 quantity');
                res.status(400).json({ error: 'Cannot add more than 5 quantity' });
            } else {
                if(existingItem.quantity + req.body.quantity > 5){
                    console.log('Cannot add more than 5 quantity from the existing item');
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
        res.status(500).json({ error: 'Internal server error' });
    }
};


     //<------------ remove from cart -------------->
        const removeCart = async (req, res ) => {
            try {
                const cartId = req.params.id;
                const cart = await Cart.findById(cartId);
                const productId = cart.productId;
                const product = await Product.findById(productId);
                product.stock += cart.quantity
                await product.save();
                await Cart.findByIdAndDelete(cartId);
                res.redirect('/cart');
                console.log('Successfully Removed from cart');
                } catch (error) {
                console.log(error.message);
            }
        };

   //<------------ load checkout page -------------->
        const getCheckout = async (req, res) => {
            try {
                // {addressType:{$eq : 'Permanant'}}
                const userId = req.session.user;
                const getUser = await User.findById(userId)
                const cart = await Cart.find({userId : userId});
                const productIds = cart.map(item => item.productId);
                const products = await Product.find({ _id: { $in: productIds } });
                const address = await Address.findOne({ userId:{ $in : userId } });
                if(!address) {
                    res.send('No address found')
                }else{
                    const totalPrice = req.params.id;
                    res.render('checkout',{address, getUser,products,totalPrice, cart});
                }
              
            }catch(error){
            console.log(error.message);
            }
       };


module.exports = {
    getCart,
    addToCart,
    removeCart,
    getCheckout
};