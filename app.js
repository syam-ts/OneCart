const express = require('express');
const app = express();

const PORT = 4000;

app.set('view engine', 'ejs')


app.listen(PORT, (req, res) => {
    console.log(`Server listening on http://localhost:${PORT} `);
})

app.get('/' ,(req, res) => {
    res.render("dress")
});