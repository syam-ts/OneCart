const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const nocache = require("nocache");
const app = express();
const connectDB = require('./DB/db');
const flash = require('connect-flash');
const methodOverride = require('method-override');


app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(nocache());
//.dev
dotenv.config({path:'./.env'})

const secretKey = process.env.SESSION_SECRET;

//session object
app.use(session({secret: secretKey ,cookie: { maxAge: null  }}));

app.use(flash());
// Custom middleware to modify flash messages
app.use((req, res, next) => {
    // Store original flash function
    const _flash = res.flash;

    // Override flash function to modify messages
    res.flash = function(type, message) {
        // Check if message is a string or an array of strings
        if (typeof message === 'string') {
            // Modify flash message to include background color
            message = `<div style="background-color: #d4edda; padding: 10px;">${message}</div>`;
        } else if (Array.isArray(message)) {
            message = message.map(msg => {
                // Modify each flash message to include background color
                return `<div style="background-color: #d4edda; padding: 10px;">${msg}</div>`;
            });
        }

        // Call original flash function with modified message
        _flash.call(this, type, message);
    };

    next();
});


//routes
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');

//view setup
app.set('view engine', 'ejs');
app.set("views", [path.join(__dirname, "views/user"), path.join(__dirname, "views/admin")])

// Serving static files 
app.use(express.static(path.join(__dirname, 'public')));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
  };


app.use('/', userRouter);
app.use('/admin', adminRouter);

const PORT = process.env.PORT || 3000;

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB().then(() => {
        console.log('Database connected');
    }).catch((error) => {
        console.log('cant connet to the sever');
    });
});


