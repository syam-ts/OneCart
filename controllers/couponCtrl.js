const Coupon = require('../models/couponMdl');


//<------------ coupon List -------------->
    const couponList = async (req, res) => {
        try {
            const coupon = await Coupon.find();
            const currentDate = new Date();
            res.render('coupon-list', { coupon });
            coupon.forEach(async coup => {
                if (coup.expiryDate < currentDate) {
                    try {
                        await Coupon.deleteOne({ _id: coup._id });
                        console.log(`Coupon with ID ${coup._id} deleted successfully.`);
                    } catch (err) {
                        console.error(`Error deleting coupon with ID ${coup._id}:`, err);
                        res.render('error',{ message : err.message });
                  }}
             })
       }catch(err) {
        res.render('error',{ message : err.message })}
   };

   //<------------ load coupon add -------------->
        const getCouponAdd = async (req, res) => {
            try {
                res.render('coupon-add')
            } catch (err) {
                res.render('error',{ message : err.message });
            }
        };


           //<------------ adding new coupon -------------->
           const insertCoupon = async (req, res) => {
            try {
                const { couponCode, description, discount, minimumAmount, expiryDate } = req.body;
                const currentDate = new Date();
                const parsedExpiryDate = new Date(expiryDate);
                const existCoupon = await Coupon.findOne({ couponCode: couponCode });
                if (!couponCode) {
                    res.redirect('/admin/coupon-add?message=Please enter the Coupon Code&type=error');
                } else if (existCoupon) {
                    res.redirect('/admin/coupon-add?message=Coupon Name should be unique&type=error');
                } else if (!description) {
                    res.redirect('/admin/coupon-add?message=Please enter the Description&type=error');
                } else if (description.length < 20) {
                    res.redirect('/admin/coupon-add?message=Description should have at least 20 words&type=error');
                } else if (!discount) {
                    res.redirect('/admin/coupon-add?message=Please enter the Discount Amount&type=error');
                } else if (discount > 90) {
                    res.redirect('/admin/coupon-add?message=Maximum discount price should be 90%&type=error');
                } else if (!minimumAmount) {
                    res.redirect('/admin/coupon-add?message=Please enter the Minimum Amount&type=error');
                } else if (minimumAmount < 300 || minimumAmount > 40000) {
                    res.redirect('/admin/coupon-add?message=The minimum amount should be between 300 to 40000&type=error');
                } else if (!expiryDate) {
                    res.redirect('/admin/coupon-add?message=Please enter the Expiry Date&type=error');
                } else if (currentDate >= parsedExpiryDate) {
                    res.redirect('/admin/coupon-add?message=Please enter a valid expiry date&type=error');
                } else {
                    const coupon = new Coupon({
                        couponCode: couponCode,
                        description: description,
                        discount: discount,
                        minimumAmount: minimumAmount,
                        expiryDate: parsedExpiryDate 
                    });
        
                    await coupon.save();
                    res.redirect('/admin/coupon-list?message=New Coupon added&type=success');
                }
            } catch (err) {
                res.render('error', { message: err.message });
            }
        };
        


   //<------------ delete coupon -------------->
     const deleteCoupon = async (req, res) => {
      try {
          const couponId = req.params.id;
          await Coupon.findByIdAndDelete(couponId);
          res.redirect('/admin/coupon-list?message=Coupon deleted&type=success');
      } catch (err) {
          res.render('error',{ message : err.message });
      }
  };          


module.exports = {
    couponList,
    getCouponAdd,
    insertCoupon,
    deleteCoupon
  };