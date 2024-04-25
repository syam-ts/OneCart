const Coupon = require('../models/couponModel');

   //<------------ coupon List -------------->
    const couponList = async (req, res ) => {
        try {
            const coupon = await Coupon.find();
            res.render('coupon-list',{ coupon } )
        } catch (error) {
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
            const result = await coupon.save();
            res.redirect('/admin/coupon-list');

        }catch(error){
    console.log(error.message)
        }
    };



    const couponSearch = async (req, res) => {
        try {
            const searchValue = req.body.searchValue;
            const coupon = await Coupon.find({couponCode : searchValue});
            const total = req.body.totalPrice;
            const discount = coupon[0].discount;
            if(discount <= total){
                res.status(200).json({discountPrice : discount})
                
            }else{
                console.log('cannot add coupon less than minimum amount')
            }
          
        } catch (error) {
            console.log(error.message);
        }
    };

module.exports = {
    couponList,
    getCouponAdd,
    insertCoupon,
    couponSearch
}