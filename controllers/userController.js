const User = require('../models/userModel');

const insertUser = async (req, res) => {
    try {
       const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
        });

        const result = await user.save();

        res.send('Registered successfully ' + result)
        
    } catch (error) {
        res.send(error.message);
    }
};


module.exports = {
    insertUser
};