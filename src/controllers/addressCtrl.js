const Address = require('../models/addressMdl');
const countries = require('../public/countries');
const User = require('../models/userMdl');

//<------------ user address page  -------------->
const getUserAddress = async(req, res) => {
  const userId = req.session.user;
  const user = await User.findById(userId);
  const address = await Address.find({userId:{ $in : userId}});
    res.render('userAddress',{ address ,user,toastMessage: { type: 'success', text: '' } 
  })};

//<------------ loading address adding page   -------------->
   const getAddAddress = async(req, res) => {
    const userId = req.session.user;
    const user = await User.findById(userId);
    const addressId = req.params;
    res.render('addressAdd',{ countries ,user ,type: 'success', text: ''});
   };


//<------------ adding new address -------------->
  const insertAddress = async(req, res) => {
  try {
    if( req.body.name.trim() === '' || req.body.mobile.trim() === '' || req.body.address.trim() === '' || req.body.pincode.trim() === '' || req.body.city.trim() === '' || req.body.state.trim() === ''){
      res.redirect('/addAddress?message=Cannot add empty form&type=error');
    }else{
      const userId = req.session.user;
      const { name, mobile, address, pincode, city, state, country } = req.body; 
      if(mobile.trim().length < 10){
        res.redirect('/addAddress?message=Number need to be more than 10 digit&type=error');
      }else if(pincode.trim().length > 10){
        res.redirect('/addAddress?message=Pincode need to be less than 7&type=error');
      }else{
        const newAddress = new Address({
          userId:userId,
          name: name,
          mobile: mobile,
          address: address,
          pincode: pincode,
          city: city,
          state: state,
          country: country
     });
    await newAddress.save();
    res.redirect('/userAddress?message=New Address added&type=success');
  }} 
  } catch (err) {
    res.render('error',{ message : err.message });
  };
};

//<------------ load edit address -------------->
const getEditAddress = async (req, res ) => {
      try {
        const addressId = req.params.id;
        const address = await Address.findById( addressId );
        const userId = req.session.user;
          const user = await User.findById(userId);
        res.render('addressEdit',{ address ,user});
          } catch (err) {
            res.render('error',{ message : err.message });
          }
  };

//<------------ post changes in address -------------->
  const editAddress = async (req, res) => {
    try{
      const userId = req.session.user;
      const id = req.params.id;
      // console.log('The id : ',id)
    if( req.body.name.trim() === '' || req.body.mobile.trim() === '' || req.body.address.trim() === '' || req.body.pincode.trim() === '' || req.body.city.trim() === '' || req.body.state.trim() === ''){
      res.redirect(`/editAddress/${id}?message=Cannot add empty form&type=error`);
    }else{
      const { mobile, pincode } = req.body; 
      if(mobile.trim().length < 10){
        res.redirect(`/editAddress/${id}?message=Number need to be more than 10 digit&type=error`);
      }else if(pincode.trim().length > 10){
        res.redirect(`/editAddress/${id}?message=Pincode need to be less than 7&type=error`);
      }else{
      const { id: addressId } = req.params;
      const { name, mobile, address, pincode, city, state, country } = req.body;
      const addressToUpdate = await Address.findById(addressId);

      addressToUpdate.name = name;
      addressToUpdate.mobile = mobile;
      addressToUpdate.address = address;
      addressToUpdate.pincode = pincode;
      addressToUpdate.city = city;
      addressToUpdate.state = state;
      addressToUpdate.country = country;
           await addressToUpdate.save();
      res.redirect('/userAddress?message=Address edited successfully&type=success');
      }}
    } catch (err) {
      res.render('error',{ message : err.message });
    }
  };
  

//<------------ deleting address -------------->
const deleteAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    await Address.findByIdAndDelete(addressId);
   
    res.redirect('/userAddress?message=Address deleted successfully&type=success');


  } catch (err) {
    res.render('error',{ message : err.message });
  }
};

   module.exports = {
    getUserAddress,
    getAddAddress,
    insertAddress,
    getEditAddress,
    editAddress,
    deleteAddress
   };
