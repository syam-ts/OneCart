
const User = require('../models/userModel');
const express = require('express');
const bcrypt = require('bcrypt');
const Product = require('../models/productModel');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//.dev
dotenv.config({path:'./.env'})

const secretKey = process.env.SESSION_SECRET;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'syamnandhu3@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
    }
});
const randomize = require('randomatic');
const { emit } = require('nodemon');

function generateOTP() {
    // Generate a 6-character alphanumeric OTP
    return randomize('0', 4);
}



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


// Insert user data into session
const insertUser = async(req, res) => {
  try {
      const email = req.body.email;
      const OTP = generateOTP();
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

// Verify OTP
const verifyOTP = async(req, res) => {
  try {
      const { email, otp } = req.body;
      const userData = req.session.userData;

      if (!userData || userData.email !== email || userData.otp !== otp) {
          console.log('Invalid data or OTP');
          return res.send('Invalid data or OTP');
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          console.log('User already exists');
          return res.send('User already exists');
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
}


 //user login 
  const getLogin = (req, res) => {
    const user = User.findOne({email: req.body.email});
  if (req.session.user) {
    console.log(req.session.user);
   res.redirect('/home');
   } else {
      res.render('login',{msg: req.flash('msg')});
 }
  };

  //Home
  const getHome = async (req, res) => {
    try {
      const user = req.session.user;
      const isUser = await User.find({$and:[{_id:user},{isBlock: false}]});
      if(isUser.length == 1 && user){
      const products = await Product.find({deleted:false});
        res.render('home',{
          chart:[ products , {msg: req.flash('msg')} ]
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

 

   //dispaly individual product
   const displayProduct = async(req, res) => {
    try {
    const productId = req.params.id;
       const products = await Product.findById(productId);
       const user = req.session.user;
       res.render('product',{
        datas:[
          products,
          user
        ]
       });
    } catch (error) {
       console.log(error);
       res.status(500).send('Server internal Error');
    }   
   };
 
 const searchProduct = async(req, res) => {
    try {
       const products = await Product.find();
       res.render('search',{products})
    } catch (error) {
       console.log(error);
       res.status(500).send('Server internal Error');
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
   displayProduct,
   searchProduct,
    getLogout,
    verifyOtpLoad,
    verifyOTP
};