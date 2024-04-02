const Product = require('../models/productModel');

(async () => {
  console.log('Starts');

  const brandArray = [];
  console.log('Brand Array: ', Product.price);
  const res = await Product.find();

  brandArray.push(res);

  
})();
