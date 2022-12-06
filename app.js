const express = require("express");
const app = express();
const ejs_mate = require("ejs-mate");
const path = require('path');
const helmet = require("helmet");
const port = process.env.PORT || 3000;
const api_routes = require("./routes/index");



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(helmet());
app.engine('ejs', ejs_mate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static('assets'));
app.use('/images', express.static('images'));

// set the referer as such for developpement
app.use((req, res, next) => {
    req.headers.referer = " no-referrer-when-downgrade";
    next();
});


// to allow popup from google apis to work on our app
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});



app.use("/", api_routes);




app.listen(port, () => {
    console.log("server on");
})
