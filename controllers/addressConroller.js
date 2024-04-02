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
      const { name, mobile, address, pincode, city, state, country } = req.body;
  
      // Find the address by ID
      const addressToUpdate = await Address.findById(addressId);
  
      // Update the fields
      addressToUpdate.name = name;
      addressToUpdate.mobile = mobile;
      addressToUpdate.address = address;
      addressToUpdate.pincode = pincode;
      addressToUpdate.city = city;
      addressToUpdate.state = state;
      addressToUpdate.country = country;
  
      // Save the updated address
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
    getUserAddress,
    getAddAddress,
    insertAddress,
    getEditAddress,
    editAddress,
    deleteAddress
   };
