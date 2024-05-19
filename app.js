require('dotenv').config();
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
const cors = require('cors');


app.use(cors());
app.use(nocache());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//dotdev
dotenv.config({path:'./.env'})

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));




app.use(flash());
app.use((req, res, next) => {
    const _flash = res.flash;
    res.flash = function(type, message) {
        if (typeof message === 'string') {
            message = `<div style="background-color: #d4edda; padding: 10px;">${message}</div>`;
        } else if (Array.isArray(message)) {
            message = message.map(msg => {
                return `<div style="background-color: #d4edda; padding: 10px;">${msg}</div>`;
            });
        }
        _flash.call(this, type, message);
    };
    next();
});


//routes
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');

//view setup
app.set('view engine', 'ejs');
app.set("views", [path.join(__dirname, "views/user"), path.join(__dirname, "views/admin"),path.join(__dirname,"helpers")]);

// Serving static files 
app.use(express.static(path.join(__dirname, 'public')));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
  };


app.use('/', userRouter);
app.use('/admin', adminRouter);

const PORT = process.env.PORT || 4000;

// Start the server
const startServer = async () => {
    try {
        await connectDB();
        console.log('Database connected');

        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            console.error('Server error:', error.message);
        });
    } catch (error) {
        console.error('Error starting server:', error.message);
    }
};

startServer();