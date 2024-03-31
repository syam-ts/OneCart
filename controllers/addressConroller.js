const Address = require('../models/addressModel');
const countries = require('../public/countries');

//user address page
const getUserAddress = async(req, res) => {
  const address = await Address.find();
    res.render('userAddress',{ address })
   };

// laoding address adding page 
   const getAddAddress = async(req, res) => {
    const addressId = req.params;
    console.log('ADDRESS: ',addressId);
    res.render('addressAdd',{ countries });
   };

   //adding new address
  const insertAddress = async(req, res) => {
  try {
    const { name, mobile, address, pincode, city, state, country } = req.body; 
    const newAddress = new Address({
            name: name,
            mobile: mobile,
            address: address,
            pincode: pincode,
            city: city,
            state: state,
            country: country
       });
    const result = await newAddress.save();
    res.redirect('/userAddress')
  } catch (error) {
    console.log(error.message);
  };
       

  }

   module.exports = {
    getUserAddress,
    getAddAddress,
    insertAddress
   };
