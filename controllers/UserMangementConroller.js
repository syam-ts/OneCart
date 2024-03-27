const User = require('../models/userModel');

const getUsers = async(req, res) => {
 try {
    const users = await User.find({isBlock: false});
    res.render('userManagement',{users})
 } catch (error) {
    console.log(error);
    res.status(500).send('Server internal Error');
 }   
};


//delete user
const deleteUser = async (req, res) => {
   try {
       const id = req.params.id;
       const user = await User.findById(id);
       console.log(user);
       if (!user) {
           return res.status(404).send('user not found');
       }else{
       user.isBlock = true;
       await user.save();
       }
       return res.send(user);
   } catch (error) {
       console.log(error.message);
       return res.status(500).send('Internal server error');
   }
};



module.exports = {
    getUsers,
    deleteUser
};