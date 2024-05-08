const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//<------------ listing the categories -------------->
const categoryListing = async(req, res) => {
    try {
        const categories = await Category.find({});
        res.render('category-list',{categories})
    } catch (error) {
        console.log(error.message);
    }
};


//<------------ loading category adding page  -------------->
const categoryAdd = async (req, res) => {
    try {
        res.render('category-add')
    } catch (error) {
        console.log(error.message);
    }
};


//<------------ adding new category -------------->
const insertCategory = async (req, res) => {
    try {
        const {categoryName, description} = req.body;
        if(!categoryName){
            res.redirect('/admin/category-add?message=please enter category name&type=warning')}
             const isCat = await Category.findOne({ categoryName: { $regex: new RegExp('^' + categoryName + '$', 'i') } });
        if(isCat){
            res.redirect('/admin/category-add?message=Category name should be unique&type=warning');
                }else if(description.length < 20){
                res.redirect('/admin/category-add?message=Desctiption should have atleast 20 words&type=error');
                }else{
                const category = new Category({
                    categoryName: req.body.categoryName,
                    description : req.body.description
                });
               result = await category.save();
               res.redirect('/admin/category-list?message=New Category Added&type=success');
            }
        }catch (error) {
       console.error(error);
        res.status(500);
    }
};


//<------------ load category edit -------------->
const loadCategoryEdit = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById(id);
        if (!category) {
           res.render('error', {message : "Category not found"});
           }
        res.render('category-edit', { categories: category });
       } catch (err) {
          res.render('error', {message : err.message});
      }
};


//<------------ post category edit -------------->
const editCategory = async (req, res) => {
    try {
        const categoryId = req.params.id; 

            const { realCategoryName, categoryName , description } = req.body;
            if(!categoryName){
                res.redirect(`/admin/category-edit/${categoryId}?message=Please enter the Category name&type=error`);
            }else {
                const existsCategory = await Category.findOne({ 
                    categoryName: { 
                        $regex: new RegExp('^' + categoryName + '$', 'i'), 
                        $ne: realCategoryName 
                    } 
                });
                
                if(existsCategory){ 
                    res.redirect(`/admin/category-edit/${categoryId}?message=Category name must be unique&type=warning`);
                }else if(description.length < 20){
                    res.redirect(`/admin/category-edit/${categoryId}?message=Desctiption should have atleast 20 words&type=error`);
                }else{
                    const updatedFields = {};
                    if (categoryName) updatedFields.categoryName = categoryName;
                    if (description) updatedFields.description = description;
                    
                    const category = await Category.findByIdAndUpdate(categoryId, updatedFields, { new: true });
                    res.redirect('/admin/category-list?message=Category Updated&type=success')}    
            }
       }catch (err) {
        res.render('error',{ message : err.message });
    }
};




//<------------ deleting category -------------->
 const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById(id);
     if(category.deleted == false){
        category.deleted = true;
        await category.save();
        return res.redirect('/admin/category-list?message=Catergory Unlisted&type=success');
     }else if(category.deleted == true) {
        category.deleted = false;
        await category.save();
        return res.redirect('/admin/category-list?message=Catergory Listed&type=success');
     }else{
        return res.status(404).send('categrory not found');
     }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal server error');
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