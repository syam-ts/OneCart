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
        const categories = await Category.find({deleted:false});
        res.render('category-list',{categories})
    } catch (error) {
        console.log(error.message);
    }
};


const categoryAdd = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('category-add')
    } catch (error) {
        console.log(error.message);
    }
};

//delete category
const deleteCategory = async (req, res) => {
    try {
        const id = req.params;
        const category = await Category.findById(id);
        console.log(category);
        if (!category) {
            return res.status(404).send('category not found');
        }else{
        category.deleted = true;
        await category.save();
        }
        return res.send(category);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal server error');
    }
};


module.exports = {
    categoryListing,
    categoryAdd,
    insertCategory,
    deleteCategory
};