const Product = require('../models/productMdl');


  //<------------ get offerMangement -------------->
  const offerManagement = async (req, res) => {
    try {
        const allProducts = await Product.find({ deleted: false });
        const productsWithOffers = await Product.find({ 'offer': { $exists: true } });
        res.render('offerManagement', { product: productsWithOffers, allProducts });
    } catch (error) {
        console.log(error.message);
    }
};



  //<------------ insert new offer -------------->
  
  const insetOffer = async (req, res) => {
    try {
        const {productName , offerPrice } = req.body;
        const product = await Product.findOne({ productName: productName });
        if(product.offer.length != 0 ){
            res.redirect('/admin/offerManagement?message=Selected Product already has an offer&type=error');
        }else{
            const originalPrice = product.price;
            product.offer.push({ originalPrice: originalPrice });
            product.price = offerPrice; 
            await product.save();
         res.redirect('/admin/offerManagement?message=New Offer added&type=success');
        }
    } catch (error) {
        console.log(error.message);
    }
};



  //<------------ delete an offer -------------->
const deleteOffer = async (req, res) => {
    try {
      const productId = req.body.productId;
      const product = await Product.findById(productId);
     product.offer.pop();
     await product.save();
     return res.redirect('/admin/offerManagement?message=Offer deleted&type=success');
    } catch (error) {
        console.log(error.message);
    }
};


module.exports = {
    offerManagement,
    insetOffer,
    deleteOffer
}