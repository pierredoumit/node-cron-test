const express = require('express');
require('dotenv').config()
const connectDB = require('./config/db');
const app = express();

//connect db
connectDB();

//init middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs');
app.use(express.static("contents"));

app.use('/', require('./routes/bitcoin'));

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on host and port ${PORT}`));

app.get('*', (req, res, next) => {
    if (req.headers.host.slice(0, 3) != 'www') {
        res.redirect(301, 'http://www.' + req.headers.host + req.url);
    } else {
        next();
    }
});

app.get('*', (req, res) => {
    res.status(404).render("Front/Error/404", {});
});