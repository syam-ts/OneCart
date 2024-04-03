const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Address = require('../models/addressModel');
const User = require('../models/userModel');

const getCart = async (req, res) => {
    try{
        const userId = req.session.user;
        const cart = await Cart.find({userId : userId});
        const proId = await Cart.distinct("productId");
        const products = await Product.find({ _id: { $in: proId } });
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
                res.redirect('/home');
            } else {
                existingItem.quantity += req.body.qd;
                await existingItem.save();
             
                res.redirect('/home');
            }
                } catch (error) {
                    console.log(error.message);
                }
        };

  //remove from cart
  const removeCart = async (req, res ) => {
    try {
        const cartId = req.params.id;
        console.log('REQ.PARAM : ',cartId);
        await Cart.findByIdAndDelete(cartId);
        res.redirect('/cart');
console.log('Successfully Removed ');
        } catch (error) {
        console.log(error.message);
      }
   };

//load checkout page
const getCheckout = async (req, res) => {
    try {
   
       const user = req.session.user
       const getUser = await User.findById(user);
        const address = await Address.findOne();

     
      res.render('checkout',{address ,getUser})
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