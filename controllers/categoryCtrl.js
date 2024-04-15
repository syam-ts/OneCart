const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const insertCategory = async (req, res) => {
    try {
        const cat = req.body.categoryName;
        console.log('CAR NMAME:',cat);
        const isCat = await Category.findOne({categoryName:cat});
        console.log('CAT: ', isCat);
        if(isCat){
            // req.flash('msg','Successfully logged in ');
            res.send('already added');
        }else{
            const category = new Category({
                categoryName: req.body.categoryName
            });
            const result = await category.save();
    
           res.redirect('./category-list');
        }
        
    } catch (error) {
       console.error(error);
        res.status(500);
    }
};


const categoryListing = async(req, res) => {
    try {
        const categories = await Category.find({});
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
        const id = req.params.id;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).send('category not found');
        }else{
        category.deleted = true;
        await category.save();
        res.redirect('/admin/category-list');

        }
        
    } catch (error) {
        console.log('internal sever');
        return res.status(500).send('Internal server error');
    }
};

//recover category
const recoverCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).send('category not found');
        }else{
        category.deleted = false;
        await category.save();
        res.redirect('/admin/category-list');

        }
        
    } catch (error) {
        console.log('internal sever');
        return res.status(500).send('Internal server error');
    }
};


//load category edit
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


// Category edit
const editCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const updatedFields = {};
        if (categoryName) updatedFields.categoryName = categoryName;

        const categoryId = req.params.id; 
        const category = await Category.findByIdAndUpdate(categoryId, updatedFields, { new: true });

        if (!category) {
            return res.send('error');
        }
        res.redirect('/admin/category-list');
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};



module.exports = {
    categoryListing,
    categoryAdd,
    insertCategory,
    deleteCategory,
    recoverCategory,
    loadCategoryEdit,
     editCategory
};