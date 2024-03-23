const express = require('express');
const router = express.Router();

router.get('/login' ,(req, res) => {
    res.render('login')
});

router.post('/login' ,(req, res) => {
    res.redirect('/home')
});


module.exports = router;