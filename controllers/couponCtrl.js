const Coupon = require('../models/couponModel');


const couponList = async (req, res ) => {
    try {
        const coupon = await Coupon.find();
        res.render('coupon-list',{ coupon } )
    } catch (error) {
        console.log(error.message);
    }
};


const getCouponAdd = async (req, res) => {
    try {
        res.render('coupon-add')
        
    } catch (error) {
        console.log(error.message);
    }
};

const insertCoupon = async (req, res) => {
    try{

        const { couponCode, description, discount , maximumAmount , expiryDate } = req.body;

        const coupon = new Coupon({
            couponCode : couponCode,
            description : description,
            discount : discount,
            maximumAmount : maximumAmount,
            expiryDate : expiryDate
        });

        await coupon.save();
        res.redirect('/admin/coupon-list');
        console.log('FORM SUBMITTED SUCCESSFULLY');
        

    }catch(error){
console.log(error.message)
    }
}



module.exports = {
    couponList,
    getCouponAdd,
    insertCoupon
}