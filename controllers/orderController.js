


const getOrderHistory = async (req, res) => {
    try {
        

        res.render('orderHistory')
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    getOrderHistory
}