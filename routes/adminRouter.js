const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const userManagementController = require('../controllers/UserMangementCtrl');
const productContoller = require('../controllers/productCtrl');
const adminController = require('../controllers/adminCtrl');
const categoryController = require('../controllers/categoryCtrl');
const orderManagementCtrl = require('../controllers/orderManagementCtrl');
const Order = require('../models/orderModel');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

   //<------------ image rendering -------------->
const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null,'./public/product_images')
    },
    filename:(req, file, cb) => {
        const name = Date.now()+''+file.originalname;
        cb(null, name);
    }
});
const upload = multer({ storage });



   //<------------ admin-login -------------->
router.get('/admin-login',adminController.getAdmin);
router.post('/admin-login',adminController.verifyAdmin);
router.get('/admin-logout',adminController.logoutAdmin);
router.get('/dashboard',adminController.getDashboard);

   //<------------ userManagement routes -------------->
router.get('/userManagement',userManagementController.getUsers);
router.get('/user-block/:id',userManagementController.blcokUser);
router.get('/user-unblock/:id',userManagementController.unBlcokUser);

   //<------------ proudutManagement routes -------------->
router.get('/product-list',productContoller.getProduct);
router.get('/product-add' ,productContoller.loadProduct);
router.post('/product-add',upload.array('productImage'),productContoller.insertProduct);
router.get('/product-block/:id',productContoller.deleteProduct);
router.get('/product-edit/:id',productContoller.loadProductEdit);
router.post('/product-edit/:id',upload.array('productImage'),productContoller.editProduct);
router.get('/ordre',productContoller.loadProductEdit);

   //<------------ categoryManagement routes -------------->
router.get('/category-list',categoryController.categoryListing);
router.get('/category-add',categoryController.categoryAdd);
router.post('/category-add',categoryController.insertCategory);
router.get('/category-delete/:id',categoryController.deleteCategory);
router.get('/category-recover/:id',categoryController.recoverCategory);
router.get('/category-edit/:id',categoryController.loadCategoryEdit);
router.post('/category-edit/:id',categoryController.editCategory);

   //<------------ orderManagementroutes -------------->
router.get('/orderManagement',orderManagementCtrl.getOrderManagement);


router.get('/orderStatus/:id',orderManagementCtrl.getEditOrderStatus);
router.post('/orderStatus/:orderId',orderManagementCtrl.postEditOrderStatus);

router.get('/error',(req, res) => {
   res.render('error')
})

module.exports = router;
