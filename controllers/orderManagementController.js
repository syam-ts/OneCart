const Order = require('../models/orderModel');


const getOrderManagement = async (req, res ) => {
    try {
        const orders = await Order.find();                                                
        
        res.render('orderManagement',{ orders })
    } catch (error) {
        console.log(error.message);
    }
};


//<------------ load editOrderStatus -------------->
const getEditOrderStatus = async (req, res) => {
    try {
        
     
        const currentOrderStatus = req.params.id;
        res.render('orderStatus' ,{ currentOrderStatus });
    } catch (error) {
        console.log(error.message);
    }
};


const postEditOrderStatus = async (req, res) => {
    try {
        const currentOrderStatus = req.params.id;
        const updatedStatus = req.body.orderStatus;


      const updatedFields = {
        status:updatedStatus
      };

      const order = await Order.findByIdAndUpdate( currentOrderStatus, updatedFields, { new: true });
      if (!order) {
        return res.send('error');
   }
   return res.redirect('/admin/orderManagement');



    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    getOrderManagement,
    getEditOrderStatus,
    postEditOrderStatus
};