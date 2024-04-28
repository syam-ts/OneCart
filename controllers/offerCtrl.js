const Product = require('../models/productModel');


  //<------------ get offerMangement -------------->
  const offerManagement = async (req, res) => {
    try {
        const allProducts = await Product.find({ deleted: false });
        const productsWithOffers = await Product.find({ 'offer.0': { $exists: true } });

        const finalProducts = productsWithOffers.filter(product => product.offer.length > 0);

        if (finalProducts.length > 0) {
            res.render('offerManagement', { product: finalProducts, allProducts });
        } 
    } catch (error) {
        console.log(error.message);
    }
};



  //<------------ insert new offer -------------->
  
  const insetOffer = async (req, res) => {
    try {

        const productName = req.body.productName;
        const offerPrice = req.body.offerPrice;
        const product = await Product.findOne({productName : productName});
        
        product.offer.push({ originalPrice: product.price, offerPrice: offerPrice });
        await product.save()
        console.log("success");
        res.redirect('/admin/offerManagement');
        
    } catch (error) {
        console.log(error.message);
    }
};

  //<------------ delete an offer -------------->
const deleteOffer = async (req, res) => {
    try {
        console.log('Reached here');
      const productId = req.body.productId;

      const product = await Product.findById(productId);

     product.offer.pop();
     await product.save();
     res.redirect('/admin/offerManagement')
        
    } catch (error) {
        console.log(error.message);
    }
};


module.exports = {
    offerManagement,
    insetOffer,
    deleteOffer
}