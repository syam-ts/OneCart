const express = require('express');
const app = express();
const Router = express.Router();
const multer = require('multer');
const userManagementController = require('../controllers/UserMangementCtrl');
const productContoller = require('../controllers/productCtrl');
const adminController = require('../controllers/adminCtrl');
const categoryController = require('../controllers/categoryCtrl');
const orderManagementCtrl = require('../controllers/orderManagementCtrl');
const couponCtrl = require('../controllers/couponCtrl');
const offerController = require('../controllers/offerCtrl');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

   //<------------ multer config -------------->
const storage = multer.diskStorage({ destination:(req, file, cb) => { cb(null,'./public/product_images') },
      filename:(req, file, cb) => { const name = Date.now()+''+file.originalname;  cb(null, name)}});
const upload = multer({ storage });

   //<------------ admin-login -------------->
Router.get('/admin-login',adminController.getAdmin);
Router.post('/admin-login',adminController.verifyAdmin);
Router.get('/admin-logout',adminController.logoutAdmin);
Router.get('/dashboard',adminController.getDashboard);


   //<------------ userManagement routes -------------->
Router.get('/userManagement',userManagementController.getUsers);
Router.get('/user-block/:id',userManagementController.blcokUser);
Router.get('/user-unblock/:id',userManagementController.unBlcokUser);


   //<------------ proudutManagement routes -------------->
Router.get('/product-list',productContoller.productList);
Router.get('/product-add' ,productContoller.ProductAdd);
Router.post('/product-add',upload.array('productImage'),productContoller.insertProduct);
Router.get('/product-block/:id',productContoller.deleteProduct);
Router.get('/product-edit/:id',productContoller.getProductEdit);
Router.post('/product-edit/:id',upload.array('productImage'),productContoller.postProductEdit);
Router.get('/sortProductAdmin/:method',productContoller.sortProductAdmin);


   //<------------ categoryManagement routes -------------->
Router.get('/category-list',categoryController.categoryListing);
Router.get('/category-add',categoryController.categoryAdd);
Router.post('/category-add',categoryController.insertCategory);
Router.get('/category-block/:id',categoryController.deleteCategory);
Router.get('/category-delete/:id',categoryController.deleteCategory);
Router.get('/category-edit/:id',categoryController.loadCategoryEdit);
Router.post('/category-edit/:id',categoryController.editCategory);


   //<------------ orderManagement routes -------------->
Router.get('/orderManagement',orderManagementCtrl.getOrderManagement);
Router.post('/orderStatus',orderManagementCtrl.orderStatusChng);
Router.get('/sortOrderAdmin/:method',orderManagementCtrl.sortOrderAdmin);


   //<------------ salse routes -------------->
Router.get('/orderDetailsAdmin/:id',orderManagementCtrl.orderDetailsAdmin);
Router.get('/salesReport',orderManagementCtrl.getSalesReport);


   //<------------ couponManagement routes -------------->
Router.get('/coupon-list',couponCtrl.couponList);
Router.get('/coupon-add',couponCtrl.getCouponAdd);
Router.post('/coupon-add',couponCtrl.insertCoupon);


 //<------------ offerManagement routes -------------->
 Router.get('/offerManagement',offerController.offerManagement);
 Router.post('/offerManagement',offerController.insetOffer);
 Router.post('/offerManagement',offerController.insetOffer);
 Router.post('/deleteOffer',offerController.deleteOffer);

 
   //<------------ error routes -------------->
Router.get('/error',(req, res) => {res.render('error')})


module.exports = Router;
