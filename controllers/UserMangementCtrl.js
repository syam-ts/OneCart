const User = require('../models/userMdl');


//<------------ load user management -------------->
const getUsers = async(req, res) => {
 try {
    const users = await User.find();
    console.log('USERS: ',users.isBlock);

    res.render('userManagement',{users ,
        toastMessage: { type: 'success', text: '' }
        })
 } catch (error) {
    console.log(error);
    res.status(500).send('Server internal Error');
 }   
};


//<------------ block user -------------->
const blcokUser = async (req, res) => {
   try {
       const id = req.params.id;
       console.log('THe id : ',id)
       const user = await User.findById(id);

if (user.isBlock == false) {
    user.isBlock = true;
    await user.save();
    res.redirect('/admin/userManagement?message=User Blocked&type=success');

} else if(user.isBlock == true){
    user.isBlock = false;
    await user.save();
    return res.redirect('/admin/userManagement?message=User Unblocked&type=success')
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
    // unBlcokUser
};