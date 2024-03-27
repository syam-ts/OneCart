
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const Product = require('../models/productModel');

//password bcrypt
const securePassword = async(password) => {
  try {
        const passwordHash = await bcrypt.hash(password, 10);
          return passwordHash;
      } catch (error) {
        console.log(error.message);
      }
  };

   
 //verify user || login 
   const verifyLogin = async (req, res) => {
    try { 
      const  Email = req.body.email;
      const Password  = req.body.password;
      const userdata = await User.findOne({ email: Email});
      if(userdata){
        const passwordMatch = await bcrypt.compare(Password,userdata.password);
        if(passwordMatch){
            req.session.user = userdata._id;
            res.redirect('/home');
            console.log('Session started');
        }else{
          res.send('Password not matching');
        }
      }else{
        res.send('Email not matching')
      }
    } catch (error) {
      res.send(error.message)
    }
   };


//new user || signup
const insertUser = async (req, res) => {
  try {
      const secPassword = await securePassword(req.body.password);
        const user = new User({
              name: req.body.name,
              email: req.body.email,
              phone: req.body.phone,
              password: secPassword,
              is_admin:0
          });
      const userData = await user.save();
          if(userData){
              res.redirect('/login')
              console.log('Registration successful'+ userData);
              }else{
                  res.send('Registration failed')
              };
          } catch (error) {
              res.send(error.message);
          }
      };


 //user login 
  const getLogin = (req, res) => {
    const user = User.findOne({email: req.body.email});
  if (req.session.user) {
    console.log(req.session.user);
   res.redirect('/home');
   } else {
      res.render('login');
 }
  };

  //Home
  const getHome = async (req, res) => {
    try {
      const products = await Product.find();
      const user = req.session.user;
      if(user){
        res.render('home',{products})
      }else{
        res.redirect('/login')
      }
    } catch (error) {
      console.log(error.message);
    }
   };

 // logout
 const getLogout = async (req, res) => {
      try {
    req.session.destroy(err => {
        if (err) {
        console.log(err.message);
          } else {
            res.redirect('/login');
            console.log('session destroyed');
              }
            });
            } catch (error) {
              console.log(error.message);
            }
};

module.exports = {
    insertUser,
    verifyLogin,
    getLogin,
   getHome,
    getLogout
};