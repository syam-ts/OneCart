const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

const getCart = async (req, res) => {
    try{
        // const carts = await Cart.find();
        const cart = await Cart.find();
        const proId = await Cart.distinct("productId");
        
        const products = await Product.find({ _id: { $in: proId } }); 
        res.render('cart',{
            products: products,
            cart: cart
        });

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
        console.log('EXIST: ',existingItem) ;
     
        if(!existingItem){
            const cart = new Cart({
                userId: req.body.userId,
                productId: req.body.productId,
                quantity: req.body.quantity
            });
             await cart.save()
         res.redirect('/cart');
        }else{
            console.log('PATH; ',existingItem);
           existingItem.quantity += parseInt(req.body.quantity);
            await existingItem.save();
         res.redirect('/cart');
        }
    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    getCart,
    addToCart
};