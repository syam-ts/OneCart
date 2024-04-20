const Coupon = require('../models/coupon');


const couponList = async (req, res ) => {
    try {
        res.render('coupon-list')
    } catch (error) {
        console.log(error.message);
    }
};


const couponAdd = async (req, res) => {
    try {
        res.render('coupon-add')
        
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    couponList,
    couponAdd
}