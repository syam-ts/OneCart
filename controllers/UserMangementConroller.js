const User = require('../models/userModel');

const getUsers = async(req, res) => {
 try {
    const users = await User.find();
    res.render('userManagement',{users})
 } catch (error) {
    console.log(error);
    res.status(500).send('Server internal Error');
 }   
};


module.exports = {
    getUsers
};