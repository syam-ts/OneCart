const express = require('express');
const router = express.Router();

router.get('/admin_login' ,(req, res) => {
    res.render('admin_login')
});

router.post('/admin_login' ,(req, res) => {
    res.redirect('/dashboard')
});


module.exports = router;