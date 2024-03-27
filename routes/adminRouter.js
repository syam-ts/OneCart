const express = require('express');
const router = express.Router();
const multer = require('multer');
const userManagementController = require('../controllers/UserMangementConroller');
const product_listController = require('../controllers/product-listController');
const productContoller = require('../controllers/productController');
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');


const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null,'./public/product_images')
    },
    filename:(req, file, cb) => {
        const name = Date.now()+''+file.originalname;
        cb(null, name);
    }
});

const upload = multer({storage:storage});

//admin auth
const admin = {
    userName: 'admin123',
    password:'adminPassword123'
}




//admin-login
router.get('/admin-login',adminController.getAdmin);
router.post('/admin-login',adminController.verifyAdmin);

//dashboard
router.get('/dashboard',(req, res) => {res.render('dashboard')});

//userManagement
router.get('/userManagement',userManagementController.getUsers);

//proudut-list
router.get('/product-list',product_listController.getProduct);

//product add
router.get('/product-add' ,productContoller.loadProduct);
router.post('/product-add',upload.single('productImage'),productContoller.insertProduct);

// category
router.get('/category-list',categoryController.categoryListing);
router.get('/category-add',categoryController.categoryAdd);
router.post('/category-add',categoryController.insertCategory);

module.exports = router;