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
        const productName = req.body.productName;
        const offerPrice = req.body.offerPrice;
        const product = await Product.findOne({ productName: productName });

        if (product.offer && product.offer.length > 0 && product.offer[0].offerPrice !== undefined) {
            console.log('Selected product already has an offer.');
            res.redirect('/admin/offerManagement?message=Selected Product already has an offer&type=error');
        } else {
            product.offer = offerPrice;
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