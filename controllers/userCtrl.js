
const User = require('../models/userMdl');
const express = require('express');
const bcrypt = require('bcrypt');
const Product = require('../models/productMdl');
const Address = require('../models/addressMdl');
const Wallet = require('../models/walletMdl');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

dotenv.config({path:'./.env'});

//<------------ nodemailer config -------------->
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'syamnandhu3@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
    }
});
const randomize = require('randomatic');

function generateOTP() {
    // Generate a 6-character  OTP
    return randomize('0', 4);
};


//<------------ password bcrypt -------------->
const securePassword = async(password) => {
  try {
        const passwordHash = await bcrypt.hash(password, 10);
          return passwordHash;
      } catch (error) {
        console.log(error.message);
      }
  };

//<------------ user login page -------------->
    const getLogin = (req, res) => {
      const user = User.findOne({email: req.body.email});
    if (req.session.user) {
     res.redirect('/home');
     } else {
        res.render('login',{msg: req.flash('msg')});
   }
    };
   
//<------------ verify user || login -------------->
   const verifyLogin = async (req, res) => {
    try { 
      const  Email = req.body.email;
      const Password  = req.body.password;
      const userdata = await User.findOne({ $and:[{email: Email},{isBlock: false}]});
      if(userdata){
        const passwordMatch = await bcrypt.compare(Password,userdata.password);
        if(passwordMatch){
            req.session.user = userdata._id;
            req.flash('msg','Successfully logged in ');
            res.redirect('/home');
            console.log('Session started');
        }else{
          req.flash('msg', 'Password not matching')
          res.redirect('/login');
        }
      }else{
      req.flash('msg', 'Email not matching')
      res.redirect('/login');
    }
    } catch (error) {
      res.send(error.message)
    }
   };


//<------------ load signup -------------->
  const getSignup = async (req,res ) => {
    try {
      res.render('signup');
    } catch (error) {
      console.log(error.message);
    }
  };


//<------------ insert user || signup -------------->
const insertUser = async(req, res) => {
  const {name ,email ,phone, password, confirmPassword}  = req.body;
  try { 
    if(password !== confirmPassword){
      return res.status(404).send({error: "Password doesn't match , Please enter again"})
    }
 
    const existingUser = await User.findOne({email});
    if(existingUser){
      req.flash('msg','User already exist');
      console.log('User already exist');
      return res.redirect('/login');
    }


      const OTP = generateOTP();
      //Nodemailer configuration
      const mailOptions = {
          from: 'syamnandhu3@gmail.com',
          to: req.body.email,
          subject: 'Your One-Time Password (OTP)',
          text: `Your OTP is: ${OTP}`
      };
      await transporter.sendMail(mailOptions);

      req.session.userData = {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          password: req.body.password,
          otp: OTP
      };
      res.redirect('/verify-otp');
  } catch (error) {
      console.error('Error:', error.message);
  }
};


//<------------ verify otp -------------->
const verifyOTP = async(req, res) => {
  try {
      const { otp } = req.body;
      console.log('THE FIRST OTP : ',otp)
      const userData = req.session.userData;
      console.log('THE SECOND OTP : ',userData)

      if ( userData.otp !== otp) {
          console.log('Invalid data or OTP',otp);
          return res.render('verify-otp?message=invalid OTP&type=error')
      }
    
      const secPassword = await securePassword(userData.password);
      const user = new User({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: secPassword,
          isBlock: false,
          is_admin: 0
      });
      await user.save();
      console.log('User registered successfully:', user);
            // Clear the session data
      req.session.userData = null;
      res.redirect('/home');
  } catch (error) {
      console.error('Error during OTP verification:', error.message);
      res.send('An error occurred');
  }
};

const verifyOtpLoad = async(req, res) => {
  res.render('verify-otp');
};


//<------------ load home -------------->
  const getHome = async (req, res) => {
    try {
      // console.log(req.user.email);
      // if(req.user){
      //   const products = await Product.find({deleted:false});
      //   res.render('home', {
      //     products,
      //     msg: req.flash('msg'),
      //     toastMessage: { type: 'success', text: 'Successfully LoggedIn' } 
      //   }) }
      const user = req.session.user;
      const isUser = await User.find({$and:[{_id:user},{isBlock: false}]});
      
      if(isUser.length == 1 && user){
      const products = await Product.find({deleted:false});
      res.render('home', {
        products,
        msg: req.flash('msg')
      });
      }else{
         req.session.destroy();
        res.redirect('/login');
        console.log('User not found');
      }
     }
     catch (error) {
      console.log(error.message);
    }
   };


//<------------ logout -------------->
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

// const getLogout = (req, res) => {
//   req.logout(function(err) {
//       if (err) {
//           console.error("Error during logout:", err);
//           return res.status(500).send("Error during logout");
//       }
//       res.redirect('https://accounts.google.com/logout');
//   });
// };


const getForgotPassword = async (req, res) => {
  try {
    res.render('forgotPassword')
  } catch (error) {
    console.log(error.message);
  }
};

const userProfileSidebar = async (req, res) => {
  try {
    const userId = req.session.user;
    const user = await User.find(userId);
    res.render('userProfileSidebar',{user})
  } catch (error) {
    console.log(error.message);
  }
};


//<------------ user profile -------------->
      const userProfile = async (req, res) => {
        try {
          const userId = req.session.user;
         
          const wallet = await Wallet.find({userId : userId})
          const user = await User.findById(userId);
          const address = await Address.find({userId : userId});
            res.render('userProfile',{ user, address , wallet});
            
        } catch (error) {
          console.log(error.message);
        }
      };

//<------------ user edit -------------->
      const getUserEdit = async (req, res) => {
        try {
          const userId = req.session.user;
          const user = await User.findById(userId);
          res.render('userEdit', {user});
        } catch (error) {
          console.log(error.message);
        }
      };

//<------------ insert use details || user profile -------------->
      const insertUserDetails = async (req, res) => {
        try {
          const userImage = req.file.filename;
          const { gender ,phone } = req.body
          const updatedFields = {};
          if (userImage) updatedFields.userImage = userImage;
          if (gender) updatedFields.gender = gender;
          if (phone) updatedFields.phone = phone;
  
          const userId = req.session.user; 
          const user = await User.findByIdAndUpdate( userId, updatedFields, { new: true });
          res.redirect('/userProfile')
        } catch (error) {
          console.log(error.message);
        }
      };

      
//<------------ load user management || admin -------------->
const getUsers = async(req, res) => {
  try {
     const users = await User.find();
     res.render('userManagement',{users ,
         toastMessage: { type: 'success', text: '' }
         })
  } catch (err) {
     res.redner('error',{ message : err.message });
  }   
 };
 
 
 //<------------ block user || admin -------------->
 const blockUser = async (req, res) => {
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
    } catch (err) {
     res.redner('error',{ message : err.message });
    }
 };

module.exports = {
    insertUser,
    verifyLogin,
    getLogin,
    getSignup,
    getHome,
    getLogout,
    verifyOtpLoad,
    verifyOTP,
    getForgotPassword,
    userProfile,
    userProfileSidebar,
    getUserEdit,
    insertUserDetails,
    getUsers, 
    blockUser
};
