const express = require('express');
const app = express();

const PORT = 4000;

const homeRouter = require('./routes/home');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const productRouter = require('./routes/product');
const adminLoginRouter = require('./routes/admin_login');
const dashboardRouter = require('./routes/admin_dashboard');

app.set('view engine', 'ejs');

app.use('/', homeRouter);
app.use('/', loginRouter);
app.use('/', adminLoginRouter);
app.use('/', signupRouter);
app.use('/', dashboardRouter);

app.get('/' , (req, res) => {
    res.render('notFound')
})

app.listen(PORT, (req, res) => {
    console.log("Okk");
    console.log(`Server listening on http://localhost:${PORT} `);
})

