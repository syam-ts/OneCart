const Product = require('../models/productMdl');
const Cart = require('../models/cartMdl');
const Address = require('../models/addressMdl');
const User = require('../models/userMdl');
const Order = require('../models/orderMdl');
const Coupon = require('../models/couponMdl');
const Wallet = require('../models/walletMdl');

  //<------------ load cart page --------------> 
const getCart = async (req, res) => {
    try{
        const userId = req.session.user;
        const cart = await Cart.find({userId : userId});
        const total = await Cart.countDocuments({userId : userId});
        const productIds = cart.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });
        if(products.length != 0){
            res.render('cart',{ items:{products, cart , total}, toastMessage: { type: 'success', text: '' } }); 
               }else{
            res.render('cart',{ items:{products, cart , total}})}
            }catch(err){
                res.render('error',{ message : err.message });
            }
        };


   //<------------ adding prodcuts to cart --------------> 
   const addToCart = async (req, res) => {
    try {
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
                product.stock -= req.body.quantity;
                await product.save();
                res.status(200).json({ message: 'Product added to cart successfully' })}
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
        } catch (err) {
            res.render('error',{ message : err.message });
    };
   }
      //<------------ decreasing the cart qunatity -------------->
      const cartDec = async (req, res) => {
        try {
            const cartId = req.body.cartId;
            const currentQty = req.body.currentQty;
            const cart = await Cart.findById(cartId);
            const productId = cart.productId;
            const product = await Product.findById(productId);
            if(currentQty <= 1){
                res.json({ typeOfError: 'lessZero' });
            }else{
                product.stock += 1;
                cart.quantity -= 1;
                await Promise.all([product.save(), cart.save()]);
                res.json({ typeOfError: 'redirect' });
            }} catch (err) {
                res.render('error',{ message : err.message });
        }
       };

  //<------------ incresing the cart qunatity -------------->
       const cartInc = async (req, res) => {
        try {
            const cartId = req.body.cartId;
            const currentQty = req.body.currentQty;
            const cart = await Cart.findById(cartId);
            const productId = cart.productId;
            const product = await Product.findById(productId);
           if(currentQty >= product.stock){
              res.json({ typeOfError: 'maxStock' });
           }else if(currentQty >= 5){
              res.json({ typeOfError: 'exeedQty' });
           }else{
            product.stock -= 1;
            cart.quantity += 1;
            await Promise.all([product.save(), cart.save()]);
            res.json({ typeOfError: 'redirect' });
              }} 
              catch (err) {
                res.render('error',{ message : err.message });
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
                } catch (err) {
                    res.render('error',{ message : err.message });
            }
        };

   //<------------ load checkout page -------------->
        const getCheckout = async (req, res) => {
            try {
                const userId = req.session.user;
                const getUser = await User.findById(userId)
                const wallet = await Wallet.find({userId : userId});
                const cart = await Cart.find({userId : userId});
                const productIds = cart.map(item => item.productId);
                const quantity = cart.map(item => item.quantity);
                const products = await Product.find({ _id: { $in: productIds } });
                const address = await Address.find({ userId:{ $in : userId } }).limit(2);
                const totalPrice = req.params.id;
                const coupon = await Coupon.find({ minimumAmount :{$lte : totalPrice} });
               
                if(!address) {
                    const message = 'No address found'; 
                    res.render('error',{ message : message})
                }else{
                    res.render('checkout',{address, getUser,products,totalPrice, quantity ,coupon, wallet});
                }
            }catch(err){
                res.render('error',{ message : err.message });
            }
        };


module.exports = {
    getCart,
    addToCart,
    cartDec,
    cartInc,
    removeCart,
    getCheckout
};