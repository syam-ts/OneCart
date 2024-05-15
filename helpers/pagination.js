const Product = require('../models/productMdl');
const router = require('express').Router();

router.get('/shoppingPgtn',async (req , res) => {
    try {
        const page = parseInt(req.query.page)-1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        const sort = req.query.sort || "price";

        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {};
        if(sort[1]){
            sortBy[sort[0]] = sort[1];
        }else{
            sortBy[sort[0]] = "asc";
        };

        const product = await Product.find({name :{$regex: search, $options:"i"}})
        .sort(sortBy)
        .skip(page*limit)
        .limit(limit)

        const total = await Product.countDocuments({});

    } catch (err) {
        console.log(err);
       res.status(500).json({error : true, message: "Internal Server Error"});
    }
});

module.exports = router;