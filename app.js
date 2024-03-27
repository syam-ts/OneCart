const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const nocache = require("nocache");
const app = express();
const db = require('./DB/db');


app.use(nocache());
//.dev
dotenv.config({path:'./.env'})

const secretKey = process.env.SESSION_SECRET;

//session object
app.use(session({secret: "Key",cookie: { maxAge: 180000 }}));

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/', userRouter);
app.use('/admin', adminRouter);

const PORT = process.env.PORT || 4000;




app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
