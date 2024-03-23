const express = require('express');
const router = express.Router();

router.get('/dress' ,(req, res) => {
    res.render('dress')
})


module.exports = router;