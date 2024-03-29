const express = require('express');
const router = express.Router();
const multer = require('multer');
const app = express();
const userManagementController = require('../controllers/UserMangementConroller');
const productContoller = require('../controllers/productController');
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


//image rendering
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
};

//admin-login
router.get('/admin-login',adminController.getAdmin);
router.post('/admin-login',adminController.verifyAdmin);
router.get('/admin-logout',adminController.logoutAdmin);

//dashboard
router.get('/dashboard',adminController.requireAdminAuth, async (req, res) => {
    try {
        const users = await User.find({ isBlock: false }).count();
        const brand = await Product.find({ deleted: false }).count();
        const category = await Category.find({ deleted: false }).count();

        // Pass the chart data as an object to the dashboard template
        res.render('dashboard', { chart: [users, brand, category] });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Internal Server Error');
    }
});


//userManagement routes
router.get('/userManagement',userManagementController.getUsers);
router.get('/user-delete/:id',userManagementController.deleteUser);

//proudutManagement routes
router.get('/product-list',productContoller.getProduct);
router.get('/product-add' ,productContoller.loadProduct);
router.post('/product-add',upload.single('productImage'),productContoller.insertProduct);
router.get('/product-delete/:id',productContoller.deleteProduct);
router.get('/product-edit/:id',productContoller.loadProductEdit);
router.post('/product-edit/:id',upload.single('ProductImage'),productContoller.editProduct);


// categoryManagement routes
router.get('/category-list',categoryController.categoryListing);
router.get('/category-add',categoryController.categoryAdd);
router.post('/category-add',categoryController.insertCategory);
router.get('/category-delete/:id',categoryController.deleteCategory);
router.get('/category-recover/:id',categoryController.recoverCategory);
router.get('/category-edit/:id',categoryController.loadCategoryEdit);
router.post('/category-edit/:id',categoryController.editCategory);



module.exports = router;