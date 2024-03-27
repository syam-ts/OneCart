
const getAdmin = (req, res) => {
    try {
        res.render('admin-login')
        
    } catch (error) {
        console.log(error.message);
    }
};

//admin authentication
const admin ={
    UserName: "adminMain",
    Password: "admin123"
};

  const verifyAdmin = (req, res) => {
    try {

        if(req.body.userName == admin.UserName){
            if(req.body.password == admin.Password){

                res.render('./dashboard');

            }else{
                res.send('password incorrect');
                console.log('Admin login successfully');
            }
        }else{
          res.send('username incorrect')
    };
        
    } catch (error) {
        res.send(error.message)
    }
  }

module.exports = {
    getAdmin,
    verifyAdmin
};