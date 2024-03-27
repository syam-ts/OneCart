const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config({path:'./.env'})
const app = express();
const db = require('./DB/db');



const PORT = process.env.PORT || 4000;

//Routes
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');

//view setup
app.set('view engine', 'ejs');
app.set("views", [path.join(__dirname, "views/user"), path.join(__dirname, "views/admin")])

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/', userRouter);
app.use('/admin', adminRouter);

process.env.NODE_ENV = 'development'; 


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
