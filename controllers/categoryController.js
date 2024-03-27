const Category = require('../models/categoryModel');


const insertCategory = async (req, res) => {
    console.log('This is body', req.body.categoryName);
    try {
        const category = new Category({
            categoryName: req.body.categoryName
    
          
        });
        const result = await category.save();

       res.send('Category added successfully: ');
        
    } catch (error) {
       console.error(error);
        res.status(500).send(error.message);
    }
};

const categoryListing = async(req, res) => {
    try {
        const categories = await Category.find();
        res.render('category-list',{categories})
    } catch (error) {
        console.log(error.message);
    }
};

const categoryAdd = async(req, res) => {
    try {
        const categories = await Category.find();
        res.render('category-add')
    } catch (error) {
        console.log(error.message);
    }
};





module.exports = {
    categoryListing,
    categoryAdd,
    insertCategory
};