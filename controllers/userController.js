
const User = require('../models/userModel');
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const secretKey = process.env.SESSION_SECRET;
app.use(session({
  secret: secretKey,
    resave: false,
    saveUninitialized: true
}));


//password bcrypt
const securePassword = async(password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
    
  } catch (error) {
    console.log(error.message);
  }
};

//new user 
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
   
 //verify user || login 
   const verifyLogin = async (req, res) => {
    try { 
      const  Email = req.body.email;
      const Password  = req.body.password;
      const userdata = await User.findOne({email:Email});
      

      if(userdata){
        const passwordMatch =await bcrypt.compare(Password,userdata.password);
        if(passwordMatch){
          //session
          
         const issession = await userdata.name;

         console.log('The real user',userdata._id);
         req.session.userId 
          res.redirect('/home');

        }else{
          res.render('login');
          console.log("Password not matching");
        }

      }else{
        res.render('login')
        console.log('Email not matching');
      }
      
    } catch (error) {
      res.render('login')
      console.log(error.message);
    }
   };


  const getLogout = (req, res ) => {
    req.session.destroy(err => {
      if(err){
        console.log(err);
      }else{
        res.redirect('/login');
      }
    })
  };

 //user login 
  const getLogin = (req, res) => {
    try {
        res.render('login');
        
    } catch (error) {
        res.send(error.message);
    }
  }


  app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/login');
        }
    });
});

module.exports = {
    insertUser,
    getLogin,
    verifyLogin,
    getLogout
};