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
                    const cart = new Cart({
                        userId,
                        productId: req.body.productId,
                        quantity: req.body.quantity
                    });
                    await cart.save();
                    res.redirect('/cart');
                } else {
                    existingItem.quantity += req.body.quantity;
                    await existingItem.save();
                }
                    } catch (error) {
                        console.log(error.message);
                 }
            };

        //<------------ remove from cart -------------->
        const removeCart = async (req, res ) => {
            try {
                const cartId = req.params.id;
                await Cart.findByIdAndDelete(cartId);
                res.redirect('/cart');
        console.log('Successfully Removed ');
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