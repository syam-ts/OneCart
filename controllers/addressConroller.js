const Address = require('../models/addressModel');
const countries = require('../public/countries');

//user address page
const getUserAddress = async(req, res) => {
  const userId = req.session.user;
  const address = await Address.find({userId:{ $in : userId}});
    res.render('userAddress',{ address })
   };

  const getUserProfile = async = (req,res ) => {
    try {
      res.render('userProfile')
    } catch (error) {
      console.log(error.message);
    }
  };

// laoding address adding page 
   const getAddAddress = async(req, res) => {
    const addressId = req.params;
    res.render('addressAdd',{ countries });
   };


   //adding new address
  const insertAddress = async(req, res) => {
  try {
    const userId = req.session.user;
    const { name, mobile, address, pincode, city, state, country,addressType } = req.body; 
    const newAddress = new Address({
            userId:userId,
            name: name,
            mobile: mobile,
            address: address,
            pincode: pincode,
            city: city,
            state: state,
            country: country,
            addressType:addressType
       });
    const result = await newAddress.save();
    res.redirect('/userAddress')
  } catch (error) {
    console.log(error.message);
  };
}

// load editAddress page
const getEditAddress = async (req, res ) => {
      try {
        const addressId = req.params.id;
        const address = await Address.findById( addressId );
        res.render('addressEdit',{ address });
          } catch (error) {
            console.log(error.message);
          }
  };

  //submit changes in address
  const editAddress = async (req, res) => {
    try {
      const { id: addressId } = req.params;
      const { name, mobile, address, pincode, city, state, country, addressType } = req.body;
      const addressToUpdate = await Address.findById(addressId);
  
      addressToUpdate.name = name;
      addressToUpdate.mobile = mobile;
      addressToUpdate.address = address;
      addressToUpdate.pincode = pincode;
      addressToUpdate.city = city;
      addressToUpdate.state = state;
      addressToUpdate.country = country;
      addressToUpdate.addressType = addressType;
  
      const updatedAddress = await addressToUpdate.save();
      res.redirect('/userAddress');
    } catch (error) {
      console.log(error.message);
    }
  };
  
//deleting address
const deleteAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    await Address.findByIdAndDelete(addressId);
    res.redirect('/userAddress');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
};

   module.exports = {
    getUserProfile,
    getUserAddress,
    getAddAddress,
    insertAddress,
    getEditAddress,
    editAddress,
    deleteAddress
   };
