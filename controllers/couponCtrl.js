const Coupon = require('../models/couponModel');

   //<------------ coupon List -------------->
    const couponList = async (req, res ) => {
        try {
            const coupon = await Coupon.find();
            const currentDate = new Date();
            
            res.render('coupon-list', { coupon });
            
            coupon.forEach(async coup => {
                if (coup.expiryDate < currentDate) {
                    try {
                        await Coupon.deleteOne({ _id: coup._id });
                        console.log(`Coupon with ID ${coup._id} deleted successfully.`);
                    } catch (error) {
                        console.error(`Error deleting coupon with ID ${coup._id}:`, error);
                    }
                }
            });
    }catch(error) {
        console.log(error.message);
    }
    };

   //<------------ load coupon add -------------->
        const getCouponAdd = async (req, res) => {
            try {
                res.render('coupon-add')
            } catch (error) {
                console.log(error.message);
            }
        };

           //<------------ post coupon add -------------->
    const insertCoupon = async (req, res) => {
        try{
            const { couponCode, description, discount , minimumAmount , expiryDate } = req.body;
            const coupon = new Coupon({
                couponCode : couponCode,
                description : description,
                discount : discount,
                minimumAmount : minimumAmount,
                expiryDate : expiryDate
            });
           await coupon.save();
            res.redirect('/admin/coupon-list');

        }catch(error){
    console.log(error.message)
        }
    };


module.exports = {
    couponList,
    getCouponAdd,
    insertCoupon
}