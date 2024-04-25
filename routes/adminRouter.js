const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const userManagementController = require('../controllers/UserMangementCtrl');
const productContoller = require('../controllers/productCtrl');
const adminController = require('../controllers/adminCtrl');
const categoryController = require('../controllers/categoryCtrl');
const orderManagementCtrl = require('../controllers/orderManagementCtrl');
const couponCtrl = require('../controllers/couponCtrl');
const offerController = require('../controllers/offerCtrl');

const Order = require('../models/orderModel');


app.post('/orderManagement', function(req, res) {
   var orderId = req.body.orderId;
   var newStatus = req.body.newStatus;

   // Update order status in your database
   Order.findByIdAndUpdate(orderId, { status: newStatus }, function(err, updatedOrder) {
       if (err) {
           console.error('Error updating order status:', err);
           res.status(500).send('Error updating order status');
       } else {
           res.status(200).send('Order status updated successfully');
       }
   });
});




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

   //<------------ pagination admin -------------->
router.get('/pagination/:id', productContoller.getAdminPagination);

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
router.get('/product-list',productContoller.productList);
router.get('/product-add' ,productContoller.ProductAdd);
router.post('/product-add',upload.array('productImage'),productContoller.insertProduct);
router.get('/product-block/:id',productContoller.deleteProduct);
router.get('/product-edit/:id',productContoller.getProductEdit);
router.post('/product-edit/:id',upload.array('productImage'),productContoller.postProductEdit);

   //<------------ categoryManagement routes -------------->
router.get('/category-list',categoryController.categoryListing);
router.get('/category-add',categoryController.categoryAdd);
router.post('/category-add',categoryController.insertCategory);
router.get('/category-block/:id',categoryController.deleteCategory);


router.get('/category-delete/:id',categoryController.deleteCategory);

router.get('/category-edit/:id',categoryController.loadCategoryEdit);
router.post('/category-edit/:id',categoryController.editCategory);

   //<------------ orderManagement routes -------------->
router.get('/orderManagement',orderManagementCtrl.getOrderManagement);
router.post('/orderStatus',orderManagementCtrl.orderStatusChng);



   //<------------ salse routes -------------->
router.get('/orderDetailsAdmin/:id',orderManagementCtrl.orderDetailsAdmin);
router.get('/salesReport',orderManagementCtrl.getSalesReport);


   //<------------ couponManagement routes -------------->
router.get('/coupon-list',couponCtrl.couponList);
router.get('/coupon-add',couponCtrl.getCouponAdd);
router.post('/coupon-add',couponCtrl.insertCoupon);

 //<------------ couponManagement routes -------------->
 router.get('/offerManagement',offerController.offerManagement);
 router.post('/offerManagement',offerController.insetOffer);
 router.post('/offerManagement',offerController.insetOffer);
 router.post('/deleteOffer',offerController.deleteOffer);


   //<------------ error routes -------------->
router.get('/error',(req, res) => {res.render('error')})



module.exports = router;
