const Product = require('../models/productMdl');

(async () => {
  const brandArray = [];
  const res = await Product.find();
  brandArray.push(res);
})();
