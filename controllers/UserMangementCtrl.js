const User = require('../models/userModel');


//<------------ load user management -------------->
const getUsers = async(req, res) => {
 try {
    const users = await User.find();
    console.log('USERS: ',users.isBlock);

    res.render('userManagement',{users})
 } catch (error) {
    console.log(error);
    res.status(500).send('Server internal Error');
 }   
};


//<------------ block user -------------->
const blcokUser = async (req, res) => {
   try {
       const id = req.params.id;
       const user = await User.findById(id);

if (user.isBlock == false) {
    
    user.isBlock = true;
    await user.save();
    return res.redirect('/admin/userManagement')

} else if(user.isBlock == true){
    user.isBlock = false;
    await user.save();
    return res.redirect('/admin/userManagement')
}else{
    return res.status(404).send('user not found');
}
   } catch (error) {
       console.log(error.message);
       return res.status(500).send('Internal server error');
   }
};

//<------------ inblock user -------------->
const unBlcokUser = async (req, res) => {
   try {
       const id = req.params.id;
       const user = await User.findById(id);
       console.log(user);
       if (!user) {
           return res.status(404).send('user not found');
       }else{
      
       }
       return res.redirect('/admin/userManagement');
   } catch (error) {
       console.log(error.message);
       return res.status(500).send('Internal server error');
   }
};

module.exports = {
    getUsers,
    blcokUser,
    unBlcokUser
};