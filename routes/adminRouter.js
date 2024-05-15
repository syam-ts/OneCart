const express = require('express');
const app = express();
const Router = express.Router();
const multer = require('multer');
const userCtrl = require('../controllers/userCtrl');
const productCtrl = require('../controllers/productCtrl');
const adminCtrl = require('../controllers/adminCtrl');
const categoryCtrl = require('../controllers/categoryCtrl');
const orderAdminCtrl = require('../controllers/orderAdminCtrl');
const couponCtrl = require('../controllers/couponCtrl');
const offerCtrl = require('../controllers/offerCtrl');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
   //<------------ multer config -------------->
const storage = multer.diskStorage({ destination:(req, file, cb) => { cb(null,'./public/product_images') },
      filename:(req, file, cb) => { const name = Date.now()+''+file.originalname;  cb(null, name)}});
const upload = multer({ storage });

   //<------------ admin-login -------------->
Router.get('/admin-login',adminCtrl.getAdmin);
Router.post('/admin-login',adminCtrl.verifyAdmin);
Router.get('/admin-logout',adminCtrl.logoutAdmin);
Router.get('/dashboard',adminCtrl.getDashboard);

   //<------------ userManagement routes -------------->
Router.get('/userManagement',userCtrl.getUsers);
Router.get('/user-block/:id',userCtrl.blockUser);


   //<------------ proudutManagement routes -------------->
Router.get('/product-list',productCtrl.productList);
Router.get('/product-add' ,productCtrl.ProductAdd);
Router.post('/product-add',upload.array('productImage'),productCtrl.insertProduct);
Router.get('/product-block/:id',productCtrl.deleteProduct);
Router.get('/product-edit/:id',productCtrl.getProductEdit);
Router.post('/product-edit/:id',upload.array('productImage'),productCtrl.postProductEdit);
Router.get('/sortProductAdmin/:method',productCtrl.sortProductAdmin);


   //<------------ categoryManagement routes -------------->
Router.get('/category-list',categoryCtrl.categoryListing);
Router.get('/category-add',categoryCtrl.categoryAdd);
Router.post('/category-add',categoryCtrl.insertCategory);
Router.get('/category-block/:id',categoryCtrl.deleteCategory);
Router.get('/category-delete/:id',categoryCtrl.deleteCategory);
Router.get('/category-edit/:id',categoryCtrl.loadCategoryEdit);
Router.post('/category-edit/:id',categoryCtrl.editCategory);


   //<------------ orderManagement routes -------------->
Router.get('/orderManagement',orderAdminCtrl.getOrderManagement);
Router.post('/orderStatus',orderAdminCtrl.orderStatusChng);
Router.get('/sortOrderAdmin/:method',orderAdminCtrl.sortOrderAdmin);
Router.post('/returnAccept',orderAdminCtrl.returnAccept);
Router.post('/returnReject',orderAdminCtrl.returnReject);
Router.get('/orders/Daily',orderAdminCtrl.orderDaily) 
Router.get('/orders/Monthly',orderAdminCtrl.orderMonthly) 
Router.get('/orders/Yearly',orderAdminCtrl.orderYearly);

   //<------------ salse routes -------------->
Router.get('/orderDetailsAdmin/:id', orderAdminCtrl.orderDetailsAdmin);
Router.get('/salesReport',orderAdminCtrl.getSalesReport);
Router.get('/sortSalesReport/:format',orderAdminCtrl.salesReport);
Router.post('/customSales',orderAdminCtrl.customSales);

   //<------------ couponManagement routes -------------->
Router.get('/coupon-list',couponCtrl.couponList);
Router.get('/coupon-add',couponCtrl.getCouponAdd);
Router.post('/coupon-add',couponCtrl.insertCoupon);
Router.get('/deleteCoupon/:id',couponCtrl.deleteCoupon);


 //<------------ offerManagement routes -------------->
 Router.get('/offerManagement',offerCtrl.offerManagement);
 Router.post('/offerManagement',offerCtrl.insetOffer);
 Router.post('/offerManagement',offerCtrl.insetOffer);
 Router.post('/deleteOffer',offerCtrl.deleteOffer);

 
   //<------------ error routes -------------->
Router.get('/error',(req, res) => {res.render('error')})


module.exports = Router;
