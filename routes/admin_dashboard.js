const express = require('express');
const router = express.Router();

router.get('/dashboard' ,(req, res) => {
    res.render('dashboard')
});

router.post('/dashboard' ,(req, res) => {
    res.redirect('/home')
});


module.exports = router;