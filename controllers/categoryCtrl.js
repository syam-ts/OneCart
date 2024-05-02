const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//<------------ insert category -------------->
const insertCategory = async (req, res) => {
    try {
        const categoryName = req.body.categoryName;
        const isCat = await Category.findOne({ categoryName: { $regex: new RegExp('^' + categoryName + '$', 'i') } });
        if(isCat){
            // req.flash('msg','Successfully logged in ');
            res.send('already added');
        }else{
            const category = new Category({
                categoryName: req.body.categoryName,
                description : req.body.description
            });
           result = await category.save();
          
           res.redirect('/admin/category-list?message=New Category Added&type=success');
        }
        
    } catch (error) {
       console.error(error);
        res.status(500);
    }
};

//<------------ category lising -------------->
const categoryListing = async(req, res) => {
    try {
        const categories = await Category.find({});
        res.render('category-list',{categories})
    } catch (error) {
        console.log(error.message);
    }
};

//<------------ category adding page  -------------->
const categoryAdd = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('category-add')
    } catch (error) {
        console.log(error.message);
    }
};

//<------------ deleting category -------------->
 const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById(id);
        console.log('THE PROD: ',id);
     if(category.deleted == false){

        category.deleted = true;
        await category.save();
        return res.redirect('/admin/category-list?message=Catergory Deleted&type=success');
        
     }
     else if(category.deleted == true) {
        category.deleted = false;
        await category.save();
        return res.redirect('/admin/category-list?message=Catergory Retrieved&type=success');
     }else{
        return res.status(404).send('categrory not found');
     }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal server error');
    }
};


//<------------ load category edit -------------->
const loadCategoryEdit = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById(id);
        
        if (!category) {
           return res.status(404).send("Category not found");
        }

        res.render('category-edit', { categories: category });
       } catch (error) {
        console.log('Error:', error);
        res.status(500).send("Internal Server Error");
    }
};


//<------------ post category edit -------------->
const editCategory = async (req, res) => {
    try {
        const { categoryName , description} = req.body;
        const isCat = await Category.findOne({ categoryName: { $regex: new RegExp('^' + categoryName + '$', 'i') } });

            const updatedFields = {};
            if (categoryName) updatedFields.categoryName = categoryName;
            if (description) updatedFields.description = description;
    
            const categoryId = req.params.id; 
            const category = await Category.findByIdAndUpdate(categoryId, updatedFields, { new: true });
            if (!category) {
                return res.send('error');
            }
            res.redirect('/admin/category-list?message=Category Updated&type=success');
        
     
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

const categoryShopping = async (req, res) => {
    try {
        console.log('THe cate name : ',req.params)
        const categoryName = req.params.id;
        const products = await Product.find({category : categoryName})
        res.render('categoryPrdt', {products : products});
    } catch (error) {
        console.log(error.message);
    }
};


module.exports = {
    categoryListing,
    categoryAdd,
    insertCategory,
    deleteCategory,
    loadCategoryEdit,
     editCategory,
     categoryShopping
};