const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Address = require('../models/addressModel');

const getCart = async (req, res) => {
    try{
        const cart = await Cart.find();
        const proId = await Cart.distinct("productId");
        const products = await Product.find({ _id: { $in: proId } }); 
        const qt = await Cart.distinct('quantity');
        console.log('CART: ');
        res.render('cart', { items: { products, cart} });
    }catch(error){
        console.log(error.message);
    }
};

//adding prodcuts to cart
const addToCart = async (req, res) => {
    try {
        const productId = req.body.productId;
        const userId = req.body.userId;
        console.log('THE REAL USER :', userId);
        const existingItem = await Cart.findOne({
                productId: productId,
                userId: userId
            });
            if (!existingItem) {
                const cart = new Cart({
                    userId: req.body.userId,
                    productId: req.body.productId,
                    quantity: req.body.quantity
                });
                await cart.save();
                res.redirect('/home');
            } else {
                existingItem.quantity += req.body.quantity;
                await existingItem.save();
                console.log('FINAL ITEM : ',existingItem);
                res.redirect('/home');
            }
                } catch (error) {
                    console.log(error.message);
                }
        };

  //remove from cart
  const removeCart = async (req, res ) => {
    try {
        const { id: cartId } = req.params;
        await Cart.findByIdAndDelete(cartId);
        console.log('CART: ',req.params);
        res.redirect('/cart');

        } catch (error) {
        console.log(error.message);
      }
   };

//load checkout page
const getCheckout = async (req, res) => {
    try {
   
       
        const address = await Address.findOne();

        console.log('USER: ',address);
      res.render('checkout',{address})
    } catch (error) {
      console.log(error.message);
    }
  };



module.exports = {
    getCart,
    addToCart,
    removeCart,
    getCheckout
};